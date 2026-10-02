// Dropdown choices and pipeline stages used across the app.
// Edit these lists to change the options you see in the forms.

export const STAGES = [
  "New Lead",
  "Contacted",
  "Qualified",
  "Offer Made",
  "Under Contract",
  "Assigned",
  "Closed",
  "Dead",
  "Long-Term Follow-Up",
] as const;
export type Stage = (typeof STAGES)[number];

export const LEAD_SOURCES = [
  "Cold call",
  "Text",
  "Direct mail",
  "Driving for dollars",
  "PPC",
  "Referral",
  "Other",
];

export const TIMELINES = ["ASAP", "30 days", "60–90 days", "90+ days", "Flexible"];

export const PROPERTY_TYPES = [
  "Single-family",
  "Multi-family",
  "Condo",
  "Townhouse",
  "Mobile home",
  "Land",
];

export const CONDITIONS = ["Turnkey", "Light rehab", "Medium rehab", "Heavy rehab / teardown"];

export const OCCUPANCY = ["Owner-occupied", "Tenant", "Vacant"];

export const REHAB_PREFERENCES = ["Either", "Rehab", "Turnkey"];
