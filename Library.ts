import routines from "./Routines";

export type RoutineKey = keyof typeof routines;

export type Target = { per: "day" } | { min: number; per: "week" };

export interface Budget {
  frequency: string;
  minutes: string;
  name: string;
  target?: Target;
}

export interface RoutineGroup {
  hint?: string;
  keys: Array<RoutineKey>;
  title: string;
}

export const groups: Array<RoutineGroup> = [
  {
    hint: "Oct 2026 plan",
    keys: [
      "RightSide02Min",
      "RightSide10Min",
      "RightSide30Min",
      "RightSide60Min",
      "RightSideBadDay",
    ],
    title: "Right-side plan",
  },
  {
    keys: ["General", "Extended", "Morning", "HipFlexors", "HipHealth", "Physio"],
    title: "Stretching",
  },
  { keys: ["Shoulders", "Wrists"], title: "Shoulders and wrists" },
  { keys: ["Test"], title: "Testing" },
];

// The plan organises routines by time budget, so those lead on the home screen
export const budgets: Partial<Record<RoutineKey, Budget>> = {
  // Any plan session counts toward the daily minimum
  RightSide02Min: {
    frequency: "Every day, anywhere",
    minutes: "2",
    name: "Daily minimum",
    target: { per: "day" },
  },
  RightSide10Min: {
    frequency: "3–5 days a week",
    minutes: "10",
    name: "Short session",
    target: { min: 3, per: "week" },
  },
  RightSide30Min: {
    frequency: "2–3 days a week",
    minutes: "30",
    name: "Full session",
    target: { min: 2, per: "week" },
  },
  RightSide60Min: {
    frequency: "Once a week, optional",
    minutes: "60",
    name: "Long session",
    target: { min: 1, per: "week" },
  },
  RightSideBadDay: { frequency: "For relief on very sore days", minutes: "20–30", name: "Bad day" },
};

export { routines };
