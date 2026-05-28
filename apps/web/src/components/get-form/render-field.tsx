type FieldValue = string | boolean;

type Props = {
  field: any;
  value?: FieldValue;
  onChange?: (value: FieldValue) => void;
};

export const RenderField = ({ field, value, onChange }: Props) => {
  const commonClass =
    "mt-2 h-14 w-full rounded-2xl border border-white/10 bg-black/40 px-4 text-white outline-none";

  return (
    <div className="mb-8">
      <label className="text-lg font-medium text-white">
        {field.label}

        {field.isRequired && <span className="ml-1 text-pink-400">*</span>}
      </label>

      {field.description && <p className="mt-1 text-sm text-zinc-500">{field.description}</p>}

      {(field.type === "text" ||
        field.type === "email" ||
        field.type === "tel" ||
        field.type === "number") && (
        <input
          type={field.type === "number" ? "number" : "text"}
          className={commonClass}
          placeholder={field.placeholder ?? ""}
          value={typeof value === "string" ? value : ""}
          onChange={(event) => onChange?.(event.target.value)}
        />
      )}

      {field.type === "textarea" && (
        <textarea
          className={`${commonClass} h-40 py-4`}
          placeholder={field.placeholder ?? ""}
          value={typeof value === "string" ? value : ""}
          onChange={(event) => onChange?.(event.target.value)}
        />
      )}

      {field.type === "date" && (
        <input
          type="date"
          className={commonClass}
          value={typeof value === "string" ? value : ""}
          onChange={(event) => onChange?.(event.target.value)}
        />
      )}

      {field.type === "checkbox" && (
        <div className="mt-4 flex items-center gap-3">
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(event) => onChange?.(event.target.checked)}
          />

          <span className="text-zinc-300">{field.placeholder}</span>
        </div>
      )}
    </div>
  );
};
