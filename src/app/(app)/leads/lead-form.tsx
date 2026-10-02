"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  FormSection,
  MoneyField,
  SelectField,
  TextAreaField,
  TextField,
} from "@/components/fields";
import {
  CONDITIONS,
  LEAD_SOURCES,
  OCCUPANCY,
  PROPERTY_TYPES,
  STAGES,
  TIMELINES,
} from "@/lib/constants";
import type { Lead } from "@/lib/types";
import type { FormState } from "./actions";

type Props = {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  lead?: Lead;
  cancelHref: string;
};

export function LeadForm({ action, lead, cancelHref }: Props) {
  const [state, formAction, pending] = useActionState(action, null);

  return (
    <form action={formAction} className="space-y-4">
      <FormSection title="Seller">
        <TextField label="Seller name" name="seller_name" required defaultValue={lead?.seller_name} className="sm:col-span-2" />
        <TextField label="Phone" name="phone" type="tel" inputMode="tel" defaultValue={lead?.phone} />
        <TextField label="Email" name="email" type="email" inputMode="email" defaultValue={lead?.email} />
      </FormSection>

      <FormSection title="Property">
        <TextField label="Street address" name="property_address" defaultValue={lead?.property_address} className="sm:col-span-2" />
        <TextField label="City" name="city" defaultValue={lead?.city} />
        <div className="grid grid-cols-2 gap-4">
          <TextField label="State" name="state" defaultValue={lead?.state} placeholder="OH" />
          <TextField label="Zip" name="zip" inputMode="numeric" defaultValue={lead?.zip} />
        </div>
        <SelectField label="Property type" name="property_type" options={PROPERTY_TYPES} defaultValue={lead?.property_type} />
        <SelectField label="Condition" name="property_condition" options={CONDITIONS} defaultValue={lead?.property_condition} />
        <SelectField label="Occupancy" name="occupancy" options={OCCUPANCY} defaultValue={lead?.occupancy} />
        <MoneyField label="Asking price" name="asking_price" defaultValue={lead?.asking_price} />
      </FormSection>

      <FormSection title="Lead details">
        <SelectField label="Lead source" name="lead_source" options={LEAD_SOURCES} defaultValue={lead?.lead_source} />
        <SelectField label="Timeline" name="timeline" options={TIMELINES} defaultValue={lead?.timeline} />
        <TextAreaField label="Motivation" name="motivation" rows={2} placeholder="Why are they selling?" defaultValue={lead?.motivation} className="sm:col-span-2" />
        <TextAreaField label="Notes" name="notes" rows={4} defaultValue={lead?.notes} className="sm:col-span-2" />
      </FormSection>

      <FormSection title="Status">
        <SelectField label="Pipeline stage" name="stage" options={STAGES} allowBlank={false} defaultValue={lead?.stage ?? "New Lead"} />
        <TextField label="Next follow-up" name="next_follow_up_date" type="date" defaultValue={lead?.next_follow_up_date} />
      </FormSection>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      {/* Sticky save bar so the button is always reachable on a phone. */}
      <div className="sticky bottom-[calc(4rem+env(safe-area-inset-bottom))] z-10 -mx-4 flex gap-3 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur md:static md:mx-0 md:border-0 md:bg-transparent md:p-0">
        <button className="btn flex-1 md:flex-none" disabled={pending}>
          {pending ? "Saving…" : "Save lead"}
        </button>
        <Link href={cancelHref} className="btn-secondary flex-1 md:flex-none">Cancel</Link>
      </div>
    </form>
  );
}
