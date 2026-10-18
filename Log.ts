import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import { Task } from "./Session";

// One sitting in a routine. Saved on every completed step, so leaving early
// or the app being killed still keeps what was done.
export interface SessionRecord {
  id: string;
  routine: string;
  startedAt: number;
  // Keys of the completed steps, see `stepKey`
  steps: Array<string>;
  updatedAt: number;
}

const storageKey = "log.v1";

// Steps are identified by what they are rather than their index, so steps
// shared between routines (like R1 in every plan routine) count for each.
// The target is included so a 60 s hold doesn't count as the 120 s version.
export function stepKey(task: Task): string {
  const target = task.type === "Stretch" ? `${task.duration}s` : task.repetitions;
  return [task.name, task.side ?? "", task.set ?? "", target].join("|");
}

export function useLog(): {
  record: (session: SessionRecord) => void;
  records: Array<SessionRecord>;
} {
  const [records, setRecords] = useState<Array<SessionRecord>>([]);
  // Writes wait for the initial load so they can't overwrite stored history.
  // If loading fails, nothing is saved this run rather than risk losing it.
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(storageKey)
      .then((json) => {
        const stored: Array<SessionRecord> = json ? JSON.parse(json) : [];
        setRecords((current) => merge(stored, current));
        setLoaded(true);
      })
      // eslint-disable-next-line no-console
      .catch((error) => console.warn("Could not load the session log", error));
  }, []);

  useEffect(() => {
    if (loaded) {
      AsyncStorage.setItem(storageKey, JSON.stringify(records)).catch((error) =>
        // eslint-disable-next-line no-console
        console.warn("Could not save the session log", error),
      );
    }
  }, [loaded, records]);

  const record = useCallback((session: SessionRecord) => {
    setRecords((current) => merge(current, [session]));
  }, []);

  return { record, records };
}

// Adds or replaces records by id. A record with no steps left is dropped.
function merge(base: Array<SessionRecord>, updates: Array<SessionRecord>): Array<SessionRecord> {
  const byId = new Map(base.map((session) => [session.id, session]));
  for (const session of updates) {
    if (session.steps.length > 0) {
      byId.set(session.id, session);
    } else {
      byId.delete(session.id);
    }
  }
  return [...byId.values()];
}

// Stats

const day = 24 * 60 * 60 * 1000;

// A routine counts as done on a day when the steps done that day, across all
// sessions, cover this much of it. Lets a short routine plus the rest of a
// longer one later count as the longer one.
const coveredShare = 0.8;

function startOfDay(time: number): number {
  const date = new Date(time);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

function startOfWeek(time: number): number {
  const date = new Date(startOfDay(time));
  // Weeks start on Monday
  date.setDate(date.getDate() - ((date.getDay() + 6) % 7));
  return date.getTime();
}

function stepsByDay(records: Array<SessionRecord>): Map<number, Set<string>> {
  const days = new Map<number, Set<string>>();
  for (const session of records) {
    const start = startOfDay(session.startedAt);
    const steps = days.get(start) ?? new Set();
    session.steps.forEach((step) => steps.add(step));
    days.set(start, steps);
  }
  return days;
}

// Start of each day on which the routine was done, newest first
export function daysDone(records: Array<SessionRecord>, tasks: Array<Task>): Array<number> {
  const keys = new Set(tasks.map(stepKey));
  return [...stepsByDay(records)]
    .filter(([, steps]) => {
      const covered = [...keys].filter((key) => steps.has(key)).length;
      return covered >= keys.size * coveredShare;
    })
    .map(([start]) => start)
    .sort((a, b) => b - a);
}

export function countThisWeek(days: Array<number>, now: number): number {
  const week = startOfWeek(now);
  return days.filter((start) => start >= week).length;
}

// Consecutive days with any session among `routines`. Today not being done
// yet doesn't break the streak.
export function streak(
  records: Array<SessionRecord>,
  routines: Array<string>,
  now: number,
): { doneToday: boolean; length: number } {
  const days = new Set(
    records
      .filter((session) => routines.includes(session.routine))
      .map((session) => startOfDay(session.startedAt)),
  );
  const today = startOfDay(now);
  const doneToday = days.has(today);
  let length = 0;
  // Step by calendar day rather than 24 h so daylight saving changes don't skip a day
  const cursor = new Date(today);
  if (!doneToday) {
    cursor.setDate(cursor.getDate() - 1);
  }
  while (days.has(cursor.getTime())) {
    length++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return { doneToday, length };
}

export function formatDaysAgo(start: number, now: number): string {
  const days = Math.round((startOfDay(now) - start) / day);
  return days === 0 ? "today" : days === 1 ? "yesterday" : `${days} days ago`;
}
