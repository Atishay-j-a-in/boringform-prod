import { FC } from "react";
import { Link } from "@tanstack/react-router";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Templates", href: "/public-forms" },
  { label: "Pricing", href: "#pricing" },
  { label: "About", href: "#about" },
] as const;

const Navbar: FC = () => {
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50   ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-linear-to-r from-pink-500 to-magenta-500 rounded-lg flex items-center justify-center">
              <img src="/logo.png" width="50" height="50" alt="logo" />
            </div>
            <span className="text-white font-semibold text-lg">Boring Forms Inc.</span>
          </Link>
          <div className="flex items-center gap-8">
            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map(({ label, href }) =>
                href.startsWith("#") ? (
                  <a
                    key={href}
                    href={href}
                    onClick={(e) => handleSmoothScroll(e, href.substring(1))}
                    className="text-gray-300 hover:text-white transition-colors duration-200 text-sm font-medium cursor-pointer"
                  >
                    {label}
                  </a>
                ) : (
                  <Link
                    key={href}
                    to={href}
                    className="text-gray-300 hover:text-white transition-colors duration-200 text-sm font-medium"
                  >
                    {label}
                  </Link>
                ),
              )}
            </div>

            {/* CTA Button and Auth Links */}
            <div className="flex items-center gap-4">
              <Link
                to="/auth"
                className="text-gray-300 hover:text-white transition-colors duration-200 text-sm font-medium"
              >
                Sign In
              </Link>
              <Link
                to="/dashboard"
                className="px-6 py-2 bg-linear-to-r from-pink-500 to-rose-500 text-white rounded-full font-semibold text-sm hover:from-pink-600 hover:to-rose-600 transition-all duration-200 shadow-lg hover:shadow-pink-500/50"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
