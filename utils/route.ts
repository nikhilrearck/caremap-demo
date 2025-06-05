export const ROUTES = {
  LAUNCH: "/public/launch" as const,
  ONBOARDING: "/public/onboarding" as const,
  LOGIN: "/auth/login" as const,
  MY_HEALTH: "/home/myHealth" as const,

  EDIT_PROFILE: "/home/myHealth/profile/editProfile" as const,
} as const;
export type AppRoutes = keyof typeof ROUTES;
