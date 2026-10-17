import routines from "./Routines";

export type RoutineKey = keyof typeof routines;

export interface Budget {
  frequency: string;
  minutes: string;
  name: string;
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
  RightSide02Min: { frequency: "Every day, anywhere", minutes: "2", name: "Daily minimum" },
  RightSide10Min: { frequency: "3–5 days a week", minutes: "10", name: "Short session" },
  RightSide30Min: { frequency: "2–3 days a week", minutes: "30", name: "Full session" },
  RightSide60Min: { frequency: "Once a week, optional", minutes: "60", name: "Long session" },
  RightSideBadDay: { frequency: "For relief on very sore days", minutes: "20–30", name: "Bad day" },
};

export { routines };
