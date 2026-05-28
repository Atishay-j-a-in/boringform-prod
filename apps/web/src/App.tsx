import "./index.css";

import { trpc } from "./trpc/client";
import { useNavigate } from "@tanstack/react-router";
import Navbar from "./components/navbar";
import LandingHero from "./components/landing/landing-hero";
import AboutSection from "./components/landing/aboutSec";

export default function App() {
  const navigate = useNavigate();
  const { status } = trpc.health.getHealth.useQuery();

  const handleCreateForm = () => {
    console.log("Create form clicked");
  };

  const handleSeeTemplates = () => {
    navigate({ to: "/public-forms" });
  };

  return (
    <div className="w-full">
      {/* Background Video */}
      <div className="relative h-screen overflow-hidden bg-black">
        <video
          autoPlay
          muted
          playsInline
          preload="auto"
          src="/vid.mp4"
          className="absolute inset-0 w-full h-full object-contain z-0"
          onEnded={(e) => {
            // freeze at final frame
            e.currentTarget.currentTime = e.currentTarget.duration - 0.05;
            e.currentTarget.pause();
          }}
          onClick={() => {
            const video = document.querySelector("video");
            if (video) {
              video.muted = false;
            }
          }}
        />

        {/* Landing Hero Section */}
        <div className="relative z-10">
          <LandingHero onCreateForm={handleCreateForm} onSeeTemplates={handleSeeTemplates} />
        </div>
      </div>

      {/* About Section */}
      <AboutSection description="Create beautiful, engaging forms that your users will actually enjoy filling out." />
    </div>
  );
}
