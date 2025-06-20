import { User } from "@/services//database/migrations/v1/schema_v1";
import { AuthTokens } from "@/services/common/types";
import { logger } from "@/services/logging/logger";
import { googleConfig, TOKEN_EXPIRY } from "@/utils/config";
import { ROUTES } from "@/utils/route";
import { AuthSessionResult } from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";


const IOS_CLIENT_ID = googleConfig.GOOGLE_IOS_CLIENT_ID;
const ANDROID_CLIENT_ID = googleConfig.GOOGLE_ANDROID_CLIENT_ID;
const REDIRECT_URI = googleConfig.REDIRECT_URI;

const TEST_EXPIRY_IN_SECONDS: number | null = TOKEN_EXPIRY;

export const getGoogleAuthRequest = () => {
    return Google.useAuthRequest({
        androidClientId: ANDROID_CLIENT_ID,
        iosClientId: IOS_CLIENT_ID,
        redirectUri: REDIRECT_URI,
        selectAccount: true,
        scopes: ["openid", "profile", "email"],
    });
};

export const handleGoogleSignIn = async (
    response: AuthSessionResult,
    getUserInfo: (accessToken: string) => Promise<any>
) => {
    if (response?.type === "success" && response.authentication) {
        const { accessToken, refreshToken, issuedAt, expiresIn } = response.authentication;

        const userInfo = await getUserInfo(accessToken);

        await saveTokens({
            accessToken: accessToken,
            refreshToken: refreshToken!,
            issuedAt: issuedAt?.toString(),
            expiresIn: (TEST_EXPIRY_IN_SECONDS != null ? TEST_EXPIRY_IN_SECONDS : expiresIn)!.toString(),
        });

        await saveUser(userInfo);

        router.replace(`${ROUTES.MY_HEALTH}`);
    }
};

// --------------------------------------------------------------------------------------------------

export const scheduleTokenRefresh = async () => {
    const { refresh_token, issued_at, expires_in } = await getStoredTokens();

    if (refresh_token && issued_at && expires_in) {
        const issuedAtMs = parseInt(issued_at) * 1000;
        const expiresInMs = parseInt(expires_in) * 1000;
        const now = Date.now();
        const refreshDelay = issuedAtMs + expiresInMs - now - 5000;

        logger.debug(`📦 Scheduling refresh...`);
        logger.debug(
            `issued_at(ms): ${issuedAtMs}, expires_in(ms): ${expiresInMs}`
        );
        logger.debug(
            `⏳ Token will be refreshed in ${refreshDelay / 1000} seconds`
        );

        if (refreshDelay > 0) {
            logger.debug(`⏳ Scheduling token refresh in ${refreshDelay / 1000} seconds`);
            setTimeout(async () => {

                const isLoggedIn = await hasStoredSession();
                if (!isLoggedIn) {
                    logger.debug("⛔ Skipping token refresh — user has signed out.");
                    return;
                }

                const refreshed = await refreshAccessToken(refresh_token);
                if (refreshed) {
                    logger.debug("✅ Token refreshed via scheduled refresh");
                    scheduleTokenRefresh(); // 🔁 Schedule again
                }
            }, refreshDelay);
        } else {
            console.warn("⚠️ Refresh delay negative. Token may have already expired.");
        }
    }
};

export const initializeAuthSession = async (
    setUserData: (user: User | null) => void
): Promise<void> => {
    logger.debug("🚀 Reinitializing MainView after reload...");

    const sessionOk = await hasStoredSession();
    logger.debug("🔍 Session valid:", sessionOk);

    if (sessionOk) {
        const storedUser = await getUserFromStorage();
        if (storedUser) {
            logger.debug("👤 Loaded user:", storedUser.email);
            setUserData(storedUser);
            scheduleTokenRefresh(); // 🔁 Setup token refresh
        } else {
            console.warn("❌ User data missing. Signing out...");
            await signOut();
            router.replace(`${ROUTES.LOGIN}`);
        }
    } else {
        console.warn("❌ Session invalid. Signing out...");
        await signOut();
        router.replace(`${ROUTES.LOGIN}`);
    }
};


// --------------------------------------------------------------------------------------------------

// --------- Checking for Stored Data
export const hasStoredSession = async (): Promise<boolean> => {
    const { access_token, refresh_token, issued_at, expires_in } = await getStoredTokens();

    logger.debug(`🔍 Checking stored session...`)

    return !!access_token && !!refresh_token && !!issued_at && !!expires_in;
};


// --------- Saving Tokens
export const saveTokens = async (auth: {
    accessToken: string;
    refreshToken: string;
    issuedAt: string;
    expiresIn?: string;
}) => {
    const { accessToken, refreshToken, issuedAt, expiresIn } = auth;

    logger.debug(`\n🔐 Saving tokens...`);
    await SecureStore.setItemAsync("access_token", accessToken);
    await SecureStore.setItemAsync("refresh_token", refreshToken);
    await SecureStore.setItemAsync("issued_at", issuedAt);
    await SecureStore.setItemAsync("expires_in", (TEST_EXPIRY_IN_SECONDS != null ? TEST_EXPIRY_IN_SECONDS : expiresIn)!.toString());

    logger.debug(`Access token: ${accessToken.slice(0, 5)}... , Issued at: ${issuedAt}, Expires in: ${expiresIn}.`);

};

// --------- Saving User Data
export const saveUser = async (user: any) => {
    logger.debug(`\n👤 Saving user: ${JSON.stringify(user)}`);
    await SecureStore.setItemAsync("user", JSON.stringify(user));
};

// --------- Getting Stored Tokens
export const getStoredTokens = async (): Promise<AuthTokens> => {
    const access_token = await SecureStore.getItemAsync("access_token");
    const refresh_token = await SecureStore.getItemAsync("refresh_token");
    const issued_at = await SecureStore.getItemAsync("issued_at");
    const expires_in = await SecureStore.getItemAsync("expires_in");

    logger.debug(`\n📦 Stored Tokens:\nIssued at: ${issued_at}, Expires in: ${expires_in}`);
    return {
        access_token: access_token ?? undefined,
        refresh_token: refresh_token ?? undefined,
        issued_at: issued_at ?? undefined,
        expires_in: expires_in ?? undefined,
    };
};

// --------- Check if Access Token is Valid
export const isAccessTokenValid = ({
    issued_at,
    expires_in,
}: {
    issued_at?: string | null;
    expires_in?: string | null;
}) => {
    if (!issued_at || !expires_in) return false;

    const now = Date.now();
    const issuedAtMs = parseInt(issued_at) * 1000;
    const expiresInMs = parseInt(expires_in) * 1000;
    const expiryTime = issuedAtMs + expiresInMs;

    logger.debug(`Now: ${now}, issued at (in ms): ${issuedAtMs}, expires in (in ms): ${expiresInMs}`);
    logger.debug(`⏳ Time left: ${expiryTime - now}ms`);
    return now < expiryTime;
};

// --------- Refresh Access Token
export const refreshAccessToken = async (refresh_token: string): Promise<boolean> => {

    const CLIENT_ID =
        Platform.OS === "android"
            ? googleConfig.GOOGLE_ANDROID_CLIENT_ID
            : googleConfig.GOOGLE_IOS_CLIENT_ID;

    try {
        const res = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `client_id=${CLIENT_ID}&grant_type=refresh_token&refresh_token=${refresh_token}`,
        });

        const data = await res.json();

        if (data.access_token) {
            const issuedAt = Math.floor(Date.now() / 1000).toString();
            const expiresIn = data.expires_in;
            logger.debug(expiresIn);

            await SecureStore.setItemAsync("access_token", data.access_token);
            await SecureStore.setItemAsync("issued_at", issuedAt);
            await SecureStore.setItemAsync("expires_in", (TEST_EXPIRY_IN_SECONDS != null ? TEST_EXPIRY_IN_SECONDS : expiresIn)!.toString());

            logger.debug("✅ Token refreshed via scheduled refresh");
            logger.debug(`✅ Token refreshed: access_token=${data.access_token.slice(0, 8)}..., issued_at=${issuedAt}`);
            return true;
        } else {
            console.error("❌ Failed to refresh token:", data);
        }
    } catch (err) {
        console.error("🚨 Error refreshing token:", err);
    }
    return false;
};

// --------- Get User
export const getUserFromStorage = async (): Promise<User> => {
    let userInfo: User;
    const userJsonStr = await SecureStore.getItemAsync("user");
    const userJson = userJsonStr ? JSON.parse(userJsonStr) : null;

    if (!userJson) {
        throw new Error("No Session User found !!");
    }

    userInfo = {
        id: userJson.id,
        name: userJson.name,
        email: userJson.email,
        profile_picture_url: userJson.picture
    }

    return userInfo;
};

// --------- Clear All
export const signOut = async () => {
    const keys = ["access_token", "refresh_token", "issued_at", "expires_in", "user"];
    await Promise.all(keys.map((key) => SecureStore.deleteItemAsync(key)));
    logger.debug("🔓 User signed out and tokens cleared.");
};

// --------- Start Session
export const startSession = async (): Promise<boolean> => {
    const { access_token, refresh_token, issued_at, expires_in } = await getStoredTokens();

    if (access_token && isAccessTokenValid({ issued_at, expires_in })) {
        return true;
    }

    if (refresh_token) {
        const refreshed = await refreshAccessToken(refresh_token);
        return refreshed;
    }

    return false;
};