// --------- Mock Session for Android
import { getUserFromStorage, saveUser, signOut } from "@/services/auth-service/google-auth";
import { User } from "@/services/database/migrations/v1/schema_v1";
import { logger } from "@/services/logging/logger";
import { ROUTES } from "@/utils/route";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { MOCK_USER } from "./config-android";

export const isAndroid = Platform.OS === "android";

export const handleMockSignIn = async () => {
    console.log("🤖 Android emulator detected — skipping SSO and using mock user");

    const keys = ["access_token", "refresh_token", "issued_at", "expires_in", "user"];
    await Promise.all(keys.map((key) => SecureStore.deleteItemAsync(key)));
    logger.debug("Android - Tokens cleared.");
    await saveUser(MOCK_USER);
    router.replace(ROUTES.MY_HEALTH);
};

export const initializeMockSession = async (
    setUserData: (user: User | null) => void
): Promise<void> => {

    const storedUser = await getUserFromStorage();
    if (storedUser) {
        logger.debug("👤 Loaded user:", storedUser.email);
        setUserData(storedUser);
    } else {
        console.warn("❌ User data missing. Signing out...");
        await signOut();
        router.replace(`${ROUTES.LOGIN}`);
    }

};