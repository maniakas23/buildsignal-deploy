// Signup step 1 — account fields (extracted verbatim from SignupPage, m1(24C)).
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  showPassword: boolean;
  errors: Record<string, string>;
  setName: (v: string) => void;
  setEmail: (v: string) => void;
  setPassword: (v: string) => void;
  setConfirmPassword: (v: string) => void;
  setShowPassword: (v: boolean) => void;
  clearError: (key: string) => void;
}

export function SignupAccountStep(p: Props) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="name" className="text-[var(--bs-text-primary)]">Full Name</Label>
        <Input
          id="name"
          type="text"
          value={p.name}
          onChange={(e) => {
            p.setName(e.target.value);
            if (p.errors.name) p.clearError("name");
          }}
          placeholder="John Doe"
          className={cn(p.errors.name && "border-red-400 focus:ring-red-500/20")}
        />
        {p.errors.name && (
          <p className="text-xs text-red-400 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {p.errors.name}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-[var(--bs-text-primary)]">Work Email</Label>
        <Input
          id="email"
          type="email"
          value={p.email}
          onChange={(e) => {
            p.setEmail(e.target.value);
            if (p.errors.email) p.clearError("email");
          }}
          placeholder="you@company.com"
          className={cn(p.errors.email && "border-red-400 focus:ring-red-500/20")}
        />
        {p.errors.email && (
          <p className="text-xs text-red-400 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {p.errors.email}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-[var(--bs-text-primary)]">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={p.showPassword ? "text" : "password"}
            value={p.password}
            onChange={(e) => {
              p.setPassword(e.target.value);
              if (p.errors.password) p.clearError("password");
            }}
            placeholder="At least 8 characters with uppercase, lowercase, and number"
            className={cn(
              p.errors.password && "border-red-400 focus:ring-red-500/20",
              "pr-10"
            )}
          />
          <button
            type="button"
            onClick={() => p.setShowPassword(!p.showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--bs-text-tertiary)] hover:text-[var(--bs-text-primary)] transition-colors"
          >
            {p.showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {p.errors.password && (
          <p className="text-xs text-red-400 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {p.errors.password}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-[var(--bs-text-primary)]">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={p.confirmPassword}
          onChange={(e) => {
            p.setConfirmPassword(e.target.value);
            if (p.errors.confirmPassword) p.clearError("confirmPassword");
          }}
          placeholder="Repeat your password"
          className={cn(p.errors.confirmPassword && "border-red-400 focus:ring-red-500/20")}
        />
        {p.errors.confirmPassword && (
          <p className="text-xs text-red-400 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {p.errors.confirmPassword}
          </p>
        )}
      </div>
    </>
  );
}
