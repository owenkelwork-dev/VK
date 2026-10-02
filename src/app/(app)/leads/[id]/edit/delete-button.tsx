"use client";

import { deleteLead } from "../../actions";

export function DeleteLeadButton({ id }: { id: string }) {
  return (
    <form
      action={deleteLead.bind(null, id)}
      onSubmit={(e) => {
        if (!confirm("Delete this lead and its whole activity history? This can't be undone.")) {
          e.preventDefault();
        }
      }}
    >
      <button className="text-sm text-red-600 underline">Delete this lead</button>
    </form>
  );
}
