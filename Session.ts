import { Exercise, Stretch } from "./Data";

export type Task = Stretch | Exercise;
export type StepStatus = "done" | "skipped" | undefined;

export interface SessionState {
  endsAt: number | null;
  index: number;
  // While paused: time left on the current hold. While running: derived from endsAt.
  remainingMs: number | null;
  running: boolean;
  statuses: Array<StepStatus>;
}

export type SessionAction =
  | { now: number; type: "toggle" }
  | { now: number; type: "complete" }
  | { type: "skip" }
  | { type: "back" }
  | { index: number; type: "jump" }
  | { type: "restart" };

function holdMs(task: Task | undefined): number | null {
  return task?.type === "Stretch" ? task.duration * 1000 : null;
}

function moveTo(tasks: Array<Task>, state: SessionState, index: number): SessionState {
  return { ...state, endsAt: null, index, remainingMs: holdMs(tasks[index]), running: false };
}

function nextOpen(state: SessionState, tasks: Array<Task>): number {
  for (let i = state.index + 1; i < tasks.length; i++) {
    if (!state.statuses[i]) {
      return i;
    }
  }
  return tasks.length;
}

export function initialSession(tasks: Array<Task>): SessionState {
  return {
    endsAt: null,
    index: 0,
    remainingMs: holdMs(tasks[0]),
    running: false,
    statuses: tasks.map(() => undefined),
  };
}

export function sessionReducer(
  tasks: Array<Task>,
  state: SessionState,
  action: SessionAction,
): SessionState {
  const task = tasks[state.index];
  switch (action.type) {
    case "toggle": {
      if (task?.type !== "Stretch" || state.remainingMs == null) {
        return state;
      }
      if (state.running) {
        return {
          ...state,
          endsAt: null,
          remainingMs: Math.max(0, (state.endsAt ?? action.now) - action.now),
          running: false,
        };
      }
      return { ...state, endsAt: action.now + state.remainingMs, running: true };
    }
    case "complete": {
      if (!task) {
        return state;
      }
      const statuses = state.statuses.slice();
      statuses[state.index] = "done";
      const next = nextOpen(state, tasks);
      const nextTask = tasks[next];
      const moved = moveTo(tasks, { ...state, statuses }, next);
      // Holds flow straight into the next hold unless marked to pause after
      const keepRunning =
        state.running &&
        task.type === "Stretch" &&
        !task.pauseAfter &&
        nextTask?.type === "Stretch";
      if (keepRunning && moved.remainingMs != null) {
        return { ...moved, endsAt: action.now + moved.remainingMs, running: true };
      }
      return moved;
    }
    case "skip": {
      if (!task) {
        return state;
      }
      const statuses = state.statuses.slice();
      statuses[state.index] = statuses[state.index] ?? "skipped";
      return moveTo(tasks, { ...state, statuses }, nextOpen(state, tasks));
    }
    case "back": {
      const index = Math.max(0, state.index - 1);
      const statuses = state.statuses.slice();
      statuses[index] = undefined;
      return moveTo(tasks, { ...state, statuses }, index);
    }
    case "jump":
      return moveTo(tasks, state, Math.max(0, Math.min(tasks.length - 1, action.index)));
    case "restart":
      return initialSession(tasks);
  }
}

// Display helpers

const families: Record<string, string> = {
  H: "Hip",
  R: "Release",
  S: "Shoulder & neck",
  T: "Trunk & breathing",
};

// Plan exercises are named with a code, like "H2 Side-Lying Hip Abduction"
export function splitCode(name: string): { code?: string; family?: string; title: string } {
  const match = name.match(/^([HRST]\d{1,2}) (.+)$/);
  if (!match) {
    return { title: name };
  }
  return { code: match[1], family: families[match[1][0]], title: match[2] };
}

// The one line worth reading mid-exercise: where to feel it, else why, else a short cue
export function keyCue(description?: string): { label: string; text: string } | null {
  if (!description) {
    return null;
  }
  const feel = description.match(/\*\*Feel it:\*\*\s*([^\n]+)/);
  if (feel) {
    return { label: "Feel it", text: feel[1] };
  }
  const purpose = description.match(/\*\*Purpose:\*\*\s*([^\n]+)/);
  if (purpose) {
    return { label: "Why", text: purpose[1] };
  }
  const first = description.split("\n")[0];
  if (!/^(\*\*|- |\d+\. )/.test(first)) {
    return { label: "Cue", text: first };
  }
  return null;
}

// Splits a rep target into the big number and its label: "12–15 repetitions" -> ["12–15", "reps"]
export function repsParts(repetitions: number | string): [string, string] {
  if (typeof repetitions === "number") {
    return [String(repetitions), "reps"];
  }
  const match = repetitions.match(/^(?:an? \w+ )?([\d–-]+)\s*(.*)$/);
  if (!match) {
    return [repetitions, ""];
  }
  return [match[1], match[2].replace(/repetitions/, "reps")];
}

export function formatClock(ms: number): string {
  const seconds = Math.ceil(Math.max(0, ms) / 1000);
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

export function shortTarget(task: Task): string {
  if (task.type === "Stretch") {
    return formatClock(task.duration * 1000);
  }
  const [count, label] = repsParts(task.repetitions);
  return label === "reps" ? `×${count}` : `${count} ${label.split(" ")[0]}`;
}

// Rough time for a step, including getting into position
export function estimateSeconds(task: Task): number {
  if (task.type === "Stretch") {
    return task.duration + 10;
  }
  if (typeof task.repetitions === "number") {
    return task.repetitions * 5 + 15;
  }
  const count = Number.parseInt(task.repetitions.match(/\d+/)?.[0] ?? "10", 10);
  if (/round/.test(task.repetitions)) {
    return count * 25;
  }
  if (/minute/.test(task.repetitions)) {
    return count * 60;
  }
  if (/step/.test(task.repetitions)) {
    return count * 4;
  }
  return count * 5 + 15;
}

export function estimateMinutes(tasks: Array<Task>): number {
  return Math.max(1, Math.round(tasks.reduce((sum, task) => sum + estimateSeconds(task), 0) / 60));
}
