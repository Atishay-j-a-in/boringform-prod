type FieldValue = string | boolean;

type Props = {
  field: any;
  value?: FieldValue;
  onChange?: (value: FieldValue) => void;
};

export const RenderField = ({ field, value, onChange }: Props) => {
  const commonClass =
    "mt-2 h-14 w-full rounded-2xl border border-white/10 bg-black/40 px-4 text-white outline-none";

  const radioOptions: Array<{ label: string }> = Array.isArray(field.options)
    ? field.options.map((opt: any) => (typeof opt === "string" ? { label: opt } : opt))
    : typeof field.placeholder === "string"
      ? field.placeholder
          .split(",")
          .map((option: string) => option.trim())
          .filter(Boolean)
          .map((label: string) => ({ label }))
      : [];

  const rateMax = typeof field.max === "number" && field.max > 0 ? field.max : 5;
  const rateValue = typeof value === "string" ? value : "";

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
        <div className="mt-4 space-y-3">
          {radioOptions.length === 0 ? (
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={Boolean(value)}
                onChange={(event) => onChange?.(event.target.checked)}
              />
              <span className="text-zinc-300">{field.placeholder || "Yes"}</span>
            </div>
          ) : (
            radioOptions.map((option: { label: string }) => {
              const selected = typeof value === "string" ? value.split(",").filter(Boolean) : [];
              const isChecked = selected.includes(option.label);
              return (
                <label key={option.label} className="flex items-center gap-3 text-zinc-300">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {
                      const next = isChecked
                        ? selected.filter((v) => v !== option.label)
                        : [...selected, option.label];
                      onChange?.(next.join(","));
                    }}
                  />
                  {option.label}
                </label>
              );
            })
          )}
        </div>
      )}

      {field.type === "boolean" && (
        <div className="mt-4 flex items-center gap-3">
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(event) => onChange?.(event.target.checked)}
          />

          <span className="text-zinc-300">{field.placeholder || "Yes"}</span>
        </div>
      )}

      {field.type === "radio" && (
        <div className="mt-4 space-y-3">
          {radioOptions.length === 0 ? (
            <p className="text-sm text-zinc-500">No options provided.</p>
          ) : (
            radioOptions.map((option: { label: string }) => (
              <label key={option.label} className="flex items-center gap-3 text-zinc-300">
                <input
                  type="radio"
                  name={`field-${field.id ?? field.label}`}
                  value={option.label}
                  checked={rateValue === option.label}
                  onChange={(event) => onChange?.(event.target.value)}
                />
                {option.label}
              </label>
            ))
          )}
        </div>
      )}

      {field.type === "rate" && (
        <div className="mt-4 flex flex-wrap gap-2">
          {Array.from({ length: rateMax }, (_, index) => {
            const label = String(index + 1);
            const isActive = rateValue === label;
            return (
              <button
                key={label}
                type="button"
                onClick={() => onChange?.(label)}
                className={`h-10 w-10 rounded-full border text-sm font-medium ${
                  isActive
                    ? "border-pink-400 bg-pink-500/20 text-pink-200"
                    : "border-white/10 bg-black/40 text-zinc-300"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}

      {field.type === "file" && (
        <input
          type="file"
          className={commonClass}
          onChange={(event) => onChange?.(event.target.files?.[0]?.name ?? "")}
        />
      )}
    </div>
  );
};
