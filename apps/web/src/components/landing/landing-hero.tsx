import { FC } from "react";

interface LandingHeroProps {
  onCreateForm?: () => void;
  onSeeTemplates?: () => void;
}

const LandingHero: FC<LandingHeroProps> = ({ onCreateForm, onSeeTemplates }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-end pb-16">
      {/* Main Text */}
      <div className="text-center mb-8">
        <p className="text-white text-xl font-light">
          The form so boring, it's actually{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r bg-pink-300 font-semibold">
            brilliant.
          </span>
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 flex-wrap justify-center mb-12">
        <button
          onClick={onCreateForm}
          className="px-8 py-3 bg-linear-to-r from-pink-500 to-rose-500 text-white rounded-full font-semibold hover:from-pink-600 hover:to-rose-600 transition-all duration-200 shadow-lg hover:shadow-pink-500/50 hover:scale-105"
        >
          Create a Boring Form
        </button>
        <button
          onClick={onSeeTemplates}
          className="px-8 py-3 border border-white/30 text-white rounded-full font-semibold hover:border-white/50 hover:bg-white/5 transition-all duration-200 backdrop-blur-sm"
        >
          See Templates
        </button>
      </div>
    </div>
  );
};

export default LandingHero;
