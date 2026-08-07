import { Outlet } from "react-router-dom";

/**
 * AuthLayout — Shell for all authenticated routes.
 *
 * In a production implementation this would:
 * 1. Check authentication state (token validity, session expiry)
 * 2. Show a loading skeleton while auth state is resolving
 * 3. Redirect unauthenticated users to /login (with ?redirect= for return-after-login)
 * 4. Redirect unverified users to /verify-email
 * 5. Potentially show a persistent nav/sidebar for authenticated app views
 *
 * For BuildSignal, the protected routes share this layout wrapper so that
 * auth logic can be added in one place without duplicating it per-route.
 */
export default function AuthLayout() {
  return <Outlet />;
}
