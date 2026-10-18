import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Budget, budgets, groups, RoutineKey, routines } from "./Library";
import { countThisWeek, daysDone, formatDaysAgo, SessionRecord, streak } from "./Log";
import Paper, { bottomInset } from "./Paper";
import { estimateMinutes } from "./Session";
import { fonts, Palette } from "./theme";

export default function HomeScreen({
  current,
  onSelect,
  palette,
  records,
}: {
  current: RoutineKey | null;
  onSelect: (key: RoutineKey) => void;
  palette: Palette;
  records: Array<SessionRecord>;
}) {
  // The screen remounts whenever a session closes, so this stays fresh
  const [now] = useState(Date.now);
  const today = new Date().toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    weekday: "long",
  });
  return (
    <Paper palette={palette}>
      <ScrollView contentContainerStyle={styles.content}>
        <View>
          <Text accessibilityRole="header" style={[styles.wordmark, { color: palette.ink }]}>
            Stretch
          </Text>
          <Text style={[styles.today, { color: palette.muted }]}>{today}</Text>
        </View>
        {groups.map((group) => (
          <View key={group.title} style={styles.group}>
            <View style={[styles.groupHead, { borderColor: palette.line }]}>
              <Text accessibilityRole="header" style={[styles.groupTitle, { color: palette.ink }]}>
                {group.title}
              </Text>
              {group.hint && (
                <Text style={[styles.small, { color: palette.muted }]}>{group.hint}</Text>
              )}
            </View>
            {group.keys.every((key) => budgets[key]) ? (
              <BudgetTiles
                current={current}
                keys={group.keys}
                now={now}
                onSelect={onSelect}
                palette={palette}
                records={records}
              />
            ) : (
              <View
                style={[
                  styles.rows,
                  { backgroundColor: palette.surface, borderColor: palette.line },
                ]}
              >
                {group.keys.map((key, i) => {
                  const [last] = daysDone(records, routines[key].tasks);
                  return (
                    <Pressable
                      accessibilityRole="button"
                      key={key}
                      onPress={() => onSelect(key)}
                      style={({ pressed }) => [
                        styles.row,
                        i > 0 && {
                          borderColor: palette.line,
                          borderTopWidth: StyleSheet.hairlineWidth,
                        },
                        pressed && { backgroundColor: palette.accentSoft },
                      ]}
                    >
                      <View style={styles.rowMain}>
                        <Text
                          style={[
                            styles.rowName,
                            { color: key === current ? palette.accent : palette.ink },
                          ]}
                        >
                          {routines[key].name}
                        </Text>
                        <Text style={[styles.small, { color: palette.muted }]}>
                          {routines[key].tasks.length} steps
                          {last != null && ` · last done ${formatDaysAgo(last, now)}`}
                        </Text>
                      </View>
                      <Text style={[styles.rowTime, { color: palette.muted }]}>
                        ~{estimateMinutes(routines[key].tasks)} min
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </Paper>
  );
}

// How the plan target is going, like "2 this week" or "6-day streak"
function progress(
  key: RoutineKey,
  keys: Array<RoutineKey>,
  records: Array<SessionRecord>,
  now: number,
): { met: boolean; text: string } | null {
  const target = budgets[key]?.target;
  if (!target) {
    return null;
  }
  if (target.per === "week") {
    const count = countThisWeek(daysDone(records, routines[key].tasks), now);
    return { met: count >= target.min, text: `${count} this week` };
  }
  const { doneToday, length } = streak(records, keys, now);
  if (length === 0) {
    return null;
  }
  // The filled mark says whether today is done
  const text = length > 1 ? `${length}-day streak` : doneToday ? "Done today" : "Done yesterday";
  return { met: doneToday, text };
}

function BudgetTiles({
  current,
  keys,
  now,
  onSelect,
  palette,
  records,
}: {
  current: RoutineKey | null;
  keys: Array<RoutineKey>;
  now: number;
  onSelect: (key: RoutineKey) => void;
  palette: Palette;
  records: Array<SessionRecord>;
}) {
  // Pair the tiles into rows; an odd one out spans the full width
  const rows: Array<Array<RoutineKey>> = [];
  for (let i = 0; i < keys.length; i += 2) {
    rows.push(keys.slice(i, i + 2));
  }
  return (
    <View style={styles.tiles}>
      {rows.map((row) => (
        <View key={row.join()} style={styles.tileRow}>
          {row.map((key) => (
            <BudgetTile
              budget={budgets[key]!}
              key={key}
              onPress={() => onSelect(key)}
              palette={palette}
              progress={progress(key, keys, records, now)}
              selected={key === current}
              wide={row.length === 1}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

function BudgetTile({
  budget,
  onPress,
  palette,
  progress,
  selected,
  wide,
}: {
  budget: Budget;
  onPress: () => void;
  palette: Palette;
  progress: { met: boolean; text: string } | null;
  selected: boolean;
  wide: boolean;
}) {
  return (
    <Pressable
      accessibilityLabel={`${budget.name}, ${budget.minutes} minutes. ${budget.frequency}${progress ? `. ${progress.text}${progress.met ? ", target met" : ""}` : ""}`}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.tile,
        wide && styles.tileWide,
        {
          backgroundColor: selected || pressed ? palette.accentSoft : palette.surface,
          borderColor: selected ? palette.done : palette.line,
        },
      ]}
    >
      <View style={styles.minutes}>
        <Text style={[styles.minutesNumber, { color: selected ? palette.accent : palette.ink }]}>
          {budget.minutes}
        </Text>
        <Text style={[styles.small, { color: palette.muted }]}>min</Text>
      </View>
      <View style={wide ? styles.rowMain : undefined}>
        <Text style={[styles.tileName, { color: palette.ink }]}>{budget.name}</Text>
        <Text style={[styles.small, styles.frequency, { color: palette.muted }]}>
          {budget.frequency}
        </Text>
        {progress && (
          <View style={styles.progress}>
            <View
              style={[
                styles.progressMark,
                progress.met
                  ? { backgroundColor: palette.done, borderColor: palette.done }
                  : { borderColor: palette.muted },
              ]}
            />
            <Text style={[styles.small, { color: progress.met ? palette.ink : palette.muted }]}>
              {progress.text}
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: { gap: 30, paddingBottom: bottomInset + 24, paddingHorizontal: 22, paddingTop: 36 },
  frequency: { lineHeight: 18 },
  group: { gap: 12 },
  groupHead: {
    alignItems: "baseline",
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 6,
  },
  groupTitle: { fontFamily: fonts.display, fontSize: 17 },
  minutes: { alignItems: "baseline", flexDirection: "row", gap: 5 },
  minutesNumber: {
    fontFamily: fonts.numeralLight,
    fontSize: 40,
    fontVariant: ["tabular-nums"],
    lineHeight: 48,
  },
  progress: { alignItems: "center", flexDirection: "row", gap: 6, marginTop: 6 },
  progressMark: { borderRadius: 4, borderWidth: 1.5, height: 8, width: 8 },
  row: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  rowMain: { flex: 1 },
  rowName: { fontFamily: fonts.bodyStrong, fontSize: 15 },
  rows: { borderRadius: 10, borderWidth: StyleSheet.hairlineWidth, overflow: "hidden" },
  rowTime: { fontFamily: fonts.body, fontSize: 13, fontVariant: ["tabular-nums"] },
  small: { fontFamily: fonts.body, fontSize: 13 },
  tile: { borderRadius: 10, borderWidth: StyleSheet.hairlineWidth, flex: 1, gap: 4, padding: 14 },
  tileName: { fontFamily: fonts.bodyStrong, fontSize: 15 },
  tileRow: { flexDirection: "row", gap: 10 },
  tiles: { gap: 10 },
  tileWide: { alignItems: "center", flexDirection: "row", gap: 16 },
  today: { fontFamily: fonts.body, fontSize: 14 },
  wordmark: { fontFamily: fonts.display, fontSize: 32, letterSpacing: 0.5 },
});
