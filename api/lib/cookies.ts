export function getSessionCookieOptions(headers: Headers) {
  const isSecure =
    headers.get("x-forwarded-proto") === "https" ||
    headers.get("origin")?.startsWith("https:") ||
    false;

  return {
    path: "/",
    httpOnly: true,
    sameSite: "Lax" as const,
    secure: isSecure,
  };
}
