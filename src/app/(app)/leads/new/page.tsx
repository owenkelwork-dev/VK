import { createLead } from "../actions";
import { LeadForm } from "../lead-form";

export default function NewLeadPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <h1 className="text-xl font-semibold">Add lead</h1>
      <LeadForm action={createLead} cancelHref="/leads" />
    </div>
  );
}
