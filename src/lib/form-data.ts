// Helpers for reading values out of submitted forms.

// Text field → trimmed string, or null when left blank.
export function text(formData: FormData, name: string): string | null {
  const value = String(formData.get(name) ?? "").trim();
  return value === "" ? null : value;
}

// Money/number field → number, or null when blank. Accepts "$120,000".
export function num(formData: FormData, name: string): number | null {
  const raw = String(formData.get(name) ?? "").replace(/[$,\s]/g, "");
  if (raw === "") return null;
  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
}
