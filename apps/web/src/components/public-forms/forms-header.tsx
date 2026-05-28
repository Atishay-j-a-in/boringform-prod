import { Search } from "lucide-react";

const PublicFormsHeader = () => {
  return (
    <div>
      <h1
        className="
        text-6xl font-black
        bg-gradient-to-r
        from-pink-400
        via-purple-400
        to-blue-400
        bg-clip-text text-transparent
        "
      >
        Public Forms
      </h1>

      <p className="mt-4 text-lg text-zinc-400">Discover forms shared by the community.</p>

      <div className="relative mt-8 max-w-xl">
        <Search
          className="
          absolute left-4 top-1/2
          size-5 -translate-y-1/2
          text-zinc-500
          "
        />

        <input
          placeholder="Search public forms..."
          className="
          h-14 w-full rounded-2xl
          border border-white/10
          bg-black/40 pl-12
          text-white outline-none
          backdrop-blur-xl
          "
        />
      </div>
    </div>
  );
};
export default PublicFormsHeader;
