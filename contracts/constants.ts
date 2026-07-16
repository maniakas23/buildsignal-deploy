export const Paths = {
  oauthCallback: "/api/oauth/callback",
} as const;

export const Session = {
  cookieName: "buildsignal_session",
  maxAgeMs: 7 * 24 * 60 * 60 * 1000, // 7 days
} as const;
