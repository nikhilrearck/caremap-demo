// export const ROUTES = {
//   LAUNCH: "/public/launch" as const,
//   ONBOARDING: "/public/onboarding" as const,
//   LOGIN: "/auth/login" as const,
//   MY_HEALTH: "/home/myHealth" as const,
//   EDIT_PROFILE: "/home/myHealth/profile/editProfile" as const,

// } as const;
// export type AppRoutes = keyof typeof ROUTES;

export const ROUTE_PREFIX = {
  PUBLIC: "/public",
  AUTH: "/auth",
  HOME: "/home",
  MY_HEALTH: "/home/myHealth",
  MEDICAL_OVERVIEW: "/home/myHealth/medicalOverview",
} as const;

export const ROUTES = {
  LAUNCH: `${ROUTE_PREFIX.PUBLIC}/launch` as const,
  ONBOARDING: `${ROUTE_PREFIX.PUBLIC}/onboarding` as const,
  LOGIN: `${ROUTE_PREFIX.AUTH}/login` as const,
  MY_HEALTH: `${ROUTE_PREFIX.MY_HEALTH}` as const,
  EDIT_PROFILE: `${ROUTE_PREFIX.MY_HEALTH}/profile/editProfile` as const,

  MEDICAL_OVERVIEW: `${ROUTE_PREFIX.MEDICAL_OVERVIEW}` as const,
  SNAPSHOT: `${ROUTE_PREFIX.MEDICAL_OVERVIEW}/(medicalTabs)/snapshot` as const,
  MEDICAL_CONDITIONS: `${ROUTE_PREFIX.MEDICAL_OVERVIEW}/(medicalTabs)/medicalCondition` as const,
  MEDICAL_EQUIPMENTS: `${ROUTE_PREFIX.MEDICAL_OVERVIEW}/(medicalTabs)/medicalEquipments` as const,

} as const;

export type AppRoutes = keyof typeof ROUTES;
