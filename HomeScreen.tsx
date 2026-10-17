import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Budget, budgets, groups, RoutineKey, routines } from "./Library";
import Paper, { bottomInset } from "./Paper";
import { estimateMinutes } from "./Session";
import { fonts, Palette } from "./theme";

export default function HomeScreen({
  current,
  onSelect,
  palette,
}: {
  current: RoutineKey | null;
  onSelect: (key: RoutineKey) => void;
  palette: Palette;
}) {
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
                onSelect={onSelect}
                palette={palette}
              />
            ) : (
              <View
                style={[
                  styles.rows,
                  { backgroundColor: palette.surface, borderColor: palette.line },
                ]}
              >
                {group.keys.map((key, i) => (
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
                      </Text>
                    </View>
                    <Text style={[styles.rowTime, { color: palette.muted }]}>
                      ~{estimateMinutes(routines[key].tasks)} min
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </Paper>
  );
}

function BudgetTiles({
  current,
  keys,
  onSelect,
  palette,
}: {
  current: RoutineKey | null;
  keys: Array<RoutineKey>;
  onSelect: (key: RoutineKey) => void;
  palette: Palette;
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
  selected,
  wide,
}: {
  budget: Budget;
  onPress: () => void;
  palette: Palette;
  selected: boolean;
  wide: boolean;
}) {
  return (
    <Pressable
      accessibilityLabel={`${budget.name}, ${budget.minutes} minutes. ${budget.frequency}`}
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
