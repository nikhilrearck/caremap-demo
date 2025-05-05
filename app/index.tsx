import { Redirect } from "expo-router";
import { useAuth } from "./context/AuthProvider"; 

export default function AppNavigator() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    console.log("AppNavigator: Loading auth state...");
    return null; // Or a loading spinner
  }

  if (user) {
    console.log("AppNavigator: User EXISTS - redirecting to /home/profile", user);
    return <Redirect href="/home/profile" />;
  } else {
    console.log("AppNavigator: NO user - redirecting to /public/landing");
    return <Redirect href="/public/landing" />;
  }
}