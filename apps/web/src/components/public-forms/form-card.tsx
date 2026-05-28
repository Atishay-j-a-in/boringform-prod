import { Lock, Globe, CalendarDays } from "lucide-react";
import { format } from "date-fns";

type Props = {
  form: {
    id: string;
    title: string;
    expiresAt: Date | null;
    isProtected: boolean | null;
  };

  onClick: () => void;
};

const FormCard = ({ form, onClick }: Props) => {
  return (
    <button
      onClick={onClick}
      className="
      group
      relative
      overflow-hidden
      rounded-3xl
      border
      border-white/10
      bg-black/40
      backdrop-blur-xl
      p-6
      text-left
      transition-all
      duration-300
      hover:border-pink-500/40
      hover:bg-white/5
      hover:scale-[1.02]
      "
    >
      <div
        className="
        absolute inset-0 opacity-0
        group-hover:opacity-100
        transition-opacity duration-500
        bg-gradient-to-br
        from-pink-500/10
        via-purple-500/10
        to-blue-500/10
      "
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-2xl font-bold text-white">{form.title}</p>

            <p className="mt-2 text-sm text-zinc-400 break-all">{form.id}</p>
          </div>

          <div
            className={`
            flex items-center gap-2 rounded-full px-3 py-1 text-sm
            ${
              form.isProtected
                ? "bg-pink-500/15 text-pink-300"
                : "bg-emerald-500/15 text-emerald-300"
            }
          `}
          >
            {form.isProtected ? (
              <>
                <Lock className="size-4" />
                Protected
              </>
            ) : (
              <>
                <Globe className="size-4" />
                Public
              </>
            )}
          </div>
        </div>

        <div className="mt-6 flex items-center gap-2 text-zinc-400">
          <CalendarDays className="size-4" />

          <span className="text-sm">
            {form.expiresAt ? `Expires ${format(form.expiresAt, "PPP")}` : "No expiration"}
          </span>
        </div>
      </div>
    </button>
  );
};

export default FormCard;
