import { FC, useState } from "react";
import { Link } from "@tanstack/react-router";
import AuthForm from "../components/auth/auth-form";

const AuthPage: FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="w-full min-h-screen bg-black text-white overflow-hidden relative">
      {/* Animated gradient background */}
      <div className="fixed inset-0 z-0">
        {/* Top gradient */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-500/20 rounded-full filter blur-3xl opacity-60"></div>
        {/* Bottom gradient */}
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full filter blur-3xl opacity-40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Navbar */}
        <nav className="fixed top-0 left-0 right-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <div className="w-10 h-10 bg-linear-to-r from-pink-500 to-magenta-500 rounded-lg flex items-center justify-center">
                  <img src="/logo.png" width="50" height="50" alt="logo" />
                </div>
                <span className="text-white font-semibold text-lg">Boring Forms Inc.</span>
              </Link>
              <Link
                to="/"
                className="px-6 py-2 border border-white/30 text-white rounded-full font-semibold text-sm hover:border-white/50 hover:bg-white/5 transition-all duration-200"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="min-h-screen flex items-center justify-center px-4 pt-20">
          <div className="w-full max-w-md space-y-8">
            {/* Header */}
            <div className="text-center space-y-2 mb-12">
              <h1 className="text-4xl md:text-5xl font-bold bg-[linear-gradient(90deg,#fff_0%,#e9d5ff_35%,#c084fc_60%,#22d3ee_100%)] bg-clip-text text-transparent">
                {isLogin ? "Welcome Back" : "Get Started"}
              </h1>
              <p className="text-zinc-400 text-lg">
                {isLogin ? "Access your forms and responses" : "Create your Boring Forms account"}
              </p>
            </div>

            {/* Auth Form */}
            <AuthForm isLogin={isLogin} onToggle={() => setIsLogin(!isLogin)} />

            {/* Footer */}
            <div className="text-center text-sm text-zinc-500 space-y-2">
              <p>
                By continuing, you agree to our{" "}
                <button className="text-pink-400 hover:text-pink-300 transition-colors">
                  Terms of Service
                </button>{" "}
                and{" "}
                <button className="text-pink-400 hover:text-pink-300 transition-colors">
                  Privacy Policy
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
