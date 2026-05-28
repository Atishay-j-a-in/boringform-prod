import { FC } from "react";
import { useNavigate } from "@tanstack/react-router";
import { trpc } from "../trpc/client";
import LandingHero from "../components/landing/landing-hero";
import FeaturesSection from "../components/landing/featureSec";
import AboutSection from "../components/landing/aboutSec";
import ReviewsSection from "~/components/landing/review-sec";
import { Sparkles, Wand2, ShieldCheck, Zap } from "lucide-react";
import PricingSection from "~/components/landing/pricing-sec";
interface LandingPageProps {
  onCreateForm?: () => void;
  onSeeTemplates?: () => void;
}

const LandingPage: FC<LandingPageProps> = ({ onCreateForm, onSeeTemplates }) => {
  const navigate = useNavigate();

  // Keep the health query if needed
  const { status } = trpc.health.getHealth.useQuery();

  const handleCreateForm =
    onCreateForm ||
    (() => {
      navigate({ to: "/dashboard" });
    });

  const handleSeeTemplates =
    onSeeTemplates ||
    (() => {
      navigate({ to: "/public-forms" });
    });

  return (
    <div className="w-full">
      {/* Background Video Section */}
      <div className="relative h-screen overflow-hidden">
        <video
          autoPlay
          muted
          playsInline
          preload="auto"
          src="https://res.cloudinary.com/dvon4qxbk/video/upload/v1779811854/vid_bxlqqm.webm"
          className="fixed inset-0 w-screen h-screen object-contain z-0 pointer-events-none"
          onEnded={(e) => {
            const target = e.currentTarget as HTMLVideoElement;
            // freeze at final frame
            target.currentTime = target.duration - 0.05;
            target.pause();
          }}
          onClick={() => {
            const video = document.querySelector("video") as HTMLVideoElement;
            if (video) {
              video.muted = false;
            }
          }}
        />

        {/* Landing Hero Section */}
        <div className="absolute inset-0 z-10">
          <LandingHero onCreateForm={handleCreateForm} onSeeTemplates={handleSeeTemplates} />
        </div>
      </div>

      {/* Features Section */}
      <FeaturesSection />

      {/* About Section */}
      <AboutSection description="Boring Form helps creators and teams build satisfying, scalable, and modern forms with an intuitive visual experience." />
      <ReviewsSection
        reviews={[
          {
            name: "Aarav Sharma",
            role: "Startup Founder",
            review:
              "We replaced multiple tools with Boring Form. The experience feels incredibly smooth and modern.",
          },

          {
            name: "Sophia Lee",
            role: "Product Designer",
            review: "The form builder is visually satisfying and extremely intuitive to use.",
          },

          {
            name: "Daniel Kim",
            role: "Freelancer",
            review: "I built a complete client onboarding workflow within minutes.",
          },

          {
            name: "Riya Kapoor",
            role: "Community Manager",
            review: "Analytics and submission tracking are clean and easy to understand.",
          },

          {
            name: "Marcus Chen",
            role: "Developer",
            review: "The architecture and UX both feel thoughtfully designed.",
          },

          {
            name: "Emily Watson",
            role: "Marketing Lead",
            review: "Our campaign conversion improved after switching to Boring Form.",
          },
        ]}
      />
      <PricingSection />
    </div>
  );
};

export default LandingPage;
