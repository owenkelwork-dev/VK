// Small form building blocks shared by the lead and buyer forms.

type BaseProps = { label: string; name: string; className?: string };

export function TextField({
  label,
  name,
  defaultValue,
  type = "text",
  required,
  inputMode,
  placeholder,
  className,
  autoComplete,
}: BaseProps & {
  defaultValue?: string | number | null;
  type?: string;
  required?: boolean;
  inputMode?: "text" | "tel" | "email" | "decimal" | "numeric";
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <div className={className}>
      <label className="label" htmlFor={name}>
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      <input
        className="input"
        id={name}
        name={name}
        type={type}
        required={required}
        inputMode={inputMode}
        placeholder={placeholder}
        autoComplete={autoComplete ?? "off"}
        defaultValue={defaultValue ?? ""}
      />
    </div>
  );
}

// Dollar amount field: shows the number keypad on phones.
export function MoneyField({
  label,
  name,
  defaultValue,
  className,
}: BaseProps & { defaultValue?: number | null }) {
  return (
    <TextField
      label={label}
      name={name}
      className={className}
      inputMode="decimal"
      placeholder="$"
      defaultValue={defaultValue}
    />
  );
}

export function SelectField({
  label,
  name,
  options,
  defaultValue,
  className,
  allowBlank = true,
}: BaseProps & {
  options: readonly string[];
  defaultValue?: string | null;
  allowBlank?: boolean;
}) {
  // Keep an old value visible even if it was removed from the options list.
  const all = defaultValue && !options.includes(defaultValue) ? [...options, defaultValue] : options;
  return (
    <div className={className}>
      <label className="label" htmlFor={name}>{label}</label>
      <select className="input" id={name} name={name} defaultValue={defaultValue ?? ""}>
        {allowBlank && <option value="">—</option>}
        {all.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}

export function TextAreaField({
  label,
  name,
  defaultValue,
  rows = 3,
  className,
  placeholder,
}: BaseProps & { defaultValue?: string | null; rows?: number; placeholder?: string }) {
  return (
    <div className={className}>
      <label className="label" htmlFor={name}>{label}</label>
      <textarea
        className="input"
        id={name}
        name={name}
        rows={rows}
        placeholder={placeholder}
        defaultValue={defaultValue ?? ""}
      />
    </div>
  );
}

export function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="card">
      <h2 className="mb-4 font-semibold">{title}</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
    </section>
  );
}
