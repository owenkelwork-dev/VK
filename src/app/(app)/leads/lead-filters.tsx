"use client";

import { STAGES } from "@/lib/constants";

// Search box + stage filter. Changing the stage applies it right away.
export function LeadFilters({ q, stage }: { q: string; stage: string }) {
  return (
    <form className="flex flex-col gap-2 sm:flex-row" role="search">
      <input
        className="input sm:max-w-xs"
        type="search"
        name="q"
        defaultValue={q}
        placeholder="Search name, address, phone…"
        aria-label="Search leads"
      />
      <div className="flex gap-2">
        <select
          className="input sm:w-56"
          name="stage"
          defaultValue={stage}
          aria-label="Filter by stage"
          onChange={(e) => e.currentTarget.form?.requestSubmit()}
        >
          <option value="">All stages</option>
          {STAGES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <button className="btn-secondary">Search</button>
      </div>
    </form>
  );
}
