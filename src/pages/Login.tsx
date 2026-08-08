import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Building2, ArrowRight, Eye, EyeOff, Mail, Lock, UserPlus, ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

export function Login() {
  const navigate = useNavigate();
  const { login, loginError, loginIsPending } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login({ email, password });
      navigate("/dashboard");
    } catch (err: any) {
      const message = err?.message || "Invalid email or password. Please try again.";
      setError(message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9FC]">
      {/* Back to home */}
      <div className="p-4">
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 text-sm text-[#6B7B8F] hover:text-[#0B1F33] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md space-y-8 p-8 bg-white rounded-2xl shadow-sm border border-[#F5F5F5]">
          {/* Branding */}
          <div className="text-center">
            <div className="mx-auto h-14 w-14 bg-[rgba(31,94,255,0.08)] rounded-xl flex items-center justify-center mb-4">
              <Building2 className="h-8 w-8 text-[#1F5EFF]" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-[#0B1F33]">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-[#6B7B8F]">
              Sign in to your BuildSignal account
            </p>
          </div>

          {/* Error Message */}
          {(error || loginError) && (
            <div className="bg-red-50 border border-red-100 text-red-700 text-sm rounded-lg p-3 flex items-center gap-2">
              <span className="font-medium">{error || loginError.message}</span>
            </div>
          )}

          {/* Email/Password Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="login-email" className="text-sm font-medium text-[#0B1F33]">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7B8F]" />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  placeholder="you@company.com"
                  className="w-full rounded-lg border border-[#E5E5E5] bg-white pl-10 pr-4 py-3 text-sm text-[#0B1F33] focus:outline-none focus:ring-2 focus:ring-[#1F5EFF] focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="login-password" className="text-sm font-medium text-[#0B1F33]">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-[#1F5EFF] hover:underline font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7B8F]" />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter your password"
                  className="w-full rounded-lg border border-[#E5E5E5] bg-white pl-10 pr-10 py-3 text-sm text-[#0B1F33] focus:outline-none focus:ring-2 focus:ring-[#1F5EFF] focus:border-transparent transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7B8F] hover:text-[#0B1F33] transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loginIsPending}
              className={cn(
                "w-full flex items-center justify-center gap-2 rounded-lg bg-[#1F5EFF] px-4 py-3 text-sm font-medium text-white hover:bg-[#1F5EFF]/90 transition-colors shadow-sm",
                loginIsPending && "opacity-70 cursor-not-allowed"
              )}
            >
              {loginIsPending ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Sign up link */}
          <div className="text-center text-sm text-[#6B7B8F] pt-4 border-t border-[#F5F5F5]">
            <div className="flex items-center justify-center gap-2">
              <UserPlus className="h-4 w-4" />
              <span>Don&apos;t have an account?</span>
              <Link
                to="/signup"
                className="text-[#1F5EFF] hover:underline font-medium"
              >
                Sign up
              </Link>
            </div>
          </div>

          {/* Trust footer */}
          <div className="flex items-center justify-center gap-4 text-xs text-[#6B7B8F]">
            <span className="flex items-center gap-1">
              <Lock className="h-3 w-3" />
              SSL Secure
            </span>
            <span className="flex items-center gap-1">
              <Building2 className="h-3 w-3" />
              SOC 2 Type II
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
