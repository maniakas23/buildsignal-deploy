import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/app-store";

export const LoginPage = () => {
  const setUserEmail = useAppStore((state) => state.setUserEmail);

  return (
    <PageShell title="Login" description="Authenticate to access your signal workspaces and Stripe billing.">
      <Button onClick={() => setUserEmail("demo@buildsignal.com")}>Sign in as Demo User</Button>
    </PageShell>
  );
};
