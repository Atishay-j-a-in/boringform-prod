import { FC, useState } from "react";
import { Mail, Lock, User, ArrowRight } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useSignIn, useSignUp } from "../../hooks/api/auth";

interface AuthFormProps {
  isLogin: boolean;
  onToggle: () => void;
}

const AuthForm: FC<AuthFormProps> = ({ isLogin, onToggle }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const { signIn, isLoading: isSigningIn, error: signInError } = useSignIn();
  const { signUp, isLoading: isSigningUp, error: signUpError } = useSignUp();

  const isLoading = isLogin ? isSigningIn : isSigningUp;
  const errorMessage = isLogin ? signInError : signUpError;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await signIn({ email, password });
      } else {
        await signUp({ fullName: name, email, password });
      }

      navigate({ to: "/dashboard" });
    } catch {
      // Errors are surfaced via hook state
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-zinc-400">
            {isLogin ? "Sign in to your Boring Forms account" : "Join us to build beautiful forms"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field (Signup only) */}
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-4 top-4 w-5 h-5 text-pink-400" />
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-zinc-500 transition-all focus:bg-white/10 focus:border-pink-400/50 focus:outline-none"
                required
              />
            </div>
          )}

          {/* Email Field */}
          <div className="relative">
            <Mail className="absolute left-4 top-4 w-5 h-5 text-pink-400" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-zinc-500 transition-all focus:bg-white/10 focus:border-pink-400/50 focus:outline-none"
              required
            />
          </div>

          {/* Password Field */}
          <div className="relative">
            <Lock className="absolute left-4 top-4 w-5 h-5 text-pink-400" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-zinc-500 transition-all focus:bg-white/10 focus:border-pink-400/50 focus:outline-none"
              required
            />
          </div>

          {errorMessage && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {errorMessage}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-6 flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-pink-500 to-rose-500 text-white rounded-full font-semibold hover:from-pink-600 hover:to-rose-600 transition-all duration-200 shadow-lg hover:shadow-pink-500/50 disabled:opacity-50"
          >
            {isLoading ? (
              "Processing..."
            ) : (
              <>
                {isLogin ? "Sign In" : "Create Account"}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Toggle Link */}
        <div className="mt-6 text-center">
          <p className="text-zinc-400">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={onToggle}
              className="text-pink-400 hover:text-pink-300 font-semibold transition-colors"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
