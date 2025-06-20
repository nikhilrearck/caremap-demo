// --------- Mock Session for Android
import { Platform } from "react-native";
import { getUserFromStorage, saveUser, signOut } from "@/services/auth-service/google-auth";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import { logger } from "@/services/logging/logger";
import { ROUTES } from "@/utils/route";
import { User } from "@/services/database/migrations/v1/schema_v1";
import { MOCK_USER } from "./config-android";

export const isAndroid = Platform.OS === "android";

export const handleMockSignIn = async () => {
    console.log("🤖 Android emulator detected — skipping SSO and using mock user");

    await saveUser(MOCK_USER);
    const keys = ["access_token", "refresh_token", "issued_at", "expires_in"];
    await Promise.all(keys.map((key) => SecureStore.deleteItemAsync(key)));
    logger.debug("Android - Tokens cleared.");
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