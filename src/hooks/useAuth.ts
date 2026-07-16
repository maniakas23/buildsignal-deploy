import { useMemo } from "react";
import { useAppStore } from "@/store/app-store";

export const useAuth = () => {
  const userEmail = useAppStore((state) => state.userEmail);

  return useMemo(
    () => ({
      userEmail,
      isAuthenticated: Boolean(userEmail),
    }),
    [userEmail],
  );
};
