import type { Stage } from "@/lib/constants";

export const STAGE_COLORS: Record<Stage, string> = {
  "New Lead": "bg-sky-100 text-sky-800",
  Contacted: "bg-indigo-100 text-indigo-800",
  Qualified: "bg-violet-100 text-violet-800",
  "Offer Made": "bg-amber-100 text-amber-800",
  "Under Contract": "bg-orange-100 text-orange-800",
  Assigned: "bg-teal-100 text-teal-800",
  Closed: "bg-green-100 text-green-800",
  Dead: "bg-slate-200 text-slate-600",
  "Long-Term Follow-Up": "bg-rose-100 text-rose-800",
};

export function StageBadge({ stage }: { stage: Stage }) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${STAGE_COLORS[stage]}`}>
      {stage}
    </span>
  );
}
