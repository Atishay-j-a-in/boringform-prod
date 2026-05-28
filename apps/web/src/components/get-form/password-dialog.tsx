import { useState } from "react";

type Props = {
  open: boolean;
  onSubmit: (password: string) => void;
};

export const PasswordDialog = ({ open, onSubmit }: Props) => {
  const [password, setPassword] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xl">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-zinc-950 p-8">
        <h2 className="text-3xl font-bold text-white">Protected Form</h2>

        <p className="mt-3 text-zinc-400">Enter password to continue</p>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="mt-6 h-14 w-full rounded-2xl border border-white/10 bg-black/40 px-4 text-white outline-none"
        />

        <button
          onClick={() => onSubmit(password)}
          className="mt-6 h-14 w-full rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 font-semibold text-white"
        >
          Submit
        </button>
      </div>
    </div>
  );
};
