import { useAudioPlayer } from "expo-audio";
import { ReactNode, useCallback, useEffect, useReducer, useRef, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  ScrollViewInstance,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  BackIcon,
  CheckIcon,
  CloseIcon,
  InfoIcon,
  NextIcon,
  PauseIcon,
  PlayIcon,
  PreviousIcon,
} from "./Icons";
import { RoutineKey, routines } from "./Library";
import { SessionRecord, stepKey } from "./Log";
import Markdown from "./Markdown";
import Paper, { bottomInset } from "./Paper";
import RingTimer from "./RingTimer";
import {
  estimateSeconds,
  initialSession,
  keyCue,
  repsParts,
  sessionReducer,
  SessionState,
  shortTarget,
  splitCode,
  StepStatus,
  Task,
} from "./Session";
import { fonts, Palette } from "./theme";

// eslint-disable-next-line typescript-eslint/no-require-imports
const gongSound = require("./assets/ding.m4a");
// eslint-disable-next-line typescript-eslint/no-require-imports
const woodblockSound = require("./assets/woodblock.wav");

function newSession() {
  return { id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, startedAt: Date.now() };
}

export default function SessionScreen({
  onClose,
  onRecord,
  palette,
  routineKey,
}: {
  onClose: () => void;
  onRecord: (session: SessionRecord) => void;
  palette: Palette;
  routineKey: RoutineKey;
}) {
  const routine = routines[routineKey];
  const tasks = routine.tasks;
  const [state, dispatch] = useReducer(
    (current: SessionState, action: Parameters<typeof sessionReducer>[2]) =>
      sessionReducer(tasks, current, action),
    tasks,
    initialSession,
  );
  const [showInfo, setShowInfo] = useState(false);
  const scroll = useRef<ScrollViewInstance>(null);
  const gong = useAudioPlayer(gongSound, { downloadFirst: true });
  const woodblock = useAudioPlayer(woodblockSound, { downloadFirst: true });
  const task = tasks[state.index];
  const session = useRef(newSession());
  const recorded = useRef(false);

  // Save the completed steps as they change, so partial sessions count too
  useEffect(() => {
    const steps = tasks.filter((_, i) => state.statuses[i] === "done").map(stepKey);
    if (steps.length === 0 && !recorded.current) {
      return;
    }
    recorded.current = true;
    onRecord({ ...session.current, routine: routineKey, steps, updatedAt: Date.now() });
  }, [onRecord, routineKey, state.statuses, tasks]);

  const complete = useCallback(
    (at: number) => {
      // The woodblock marks a step that pauses the routine afterward
      if (tasks[state.index]?.pauseAfter) {
        woodblock.seekTo(0);
        woodblock.play();
      }
      dispatch({ now: at, type: "complete" });
    },
    [tasks, state.index, woodblock],
  );

  const ringGong = useCallback(() => {
    gong.seekTo(0);
    gong.play();
  }, [gong]);

  useEffect(() => {
    scroll.current?.scrollTo({ animated: true, y: 0 });
  }, [state.index]);

  const doneCount = state.statuses.filter(Boolean).length;
  const secondsLeft = tasks.reduce(
    (sum, t, i) => sum + (state.statuses[i] || i < state.index ? 0 : estimateSeconds(t)),
    0,
  );

  return (
    <Paper palette={palette}>
      <View style={styles.topBar}>
        <RoundButton label="Back to routines" onPress={onClose} palette={palette}>
          <BackIcon color={palette.muted} />
        </RoundButton>
        <Text numberOfLines={1} style={[styles.topTitle, { color: palette.ink }]}>
          {routine.name}
        </Text>
        <RoundButton label="About this routine" onPress={() => setShowInfo(true)} palette={palette}>
          <InfoIcon color={palette.muted} />
        </RoundButton>
      </View>

      <View style={styles.progress}>
        <View style={styles.segments}>
          {tasks.map((_, i) => (
            <View
              key={i}
              style={[
                styles.segment,
                {
                  backgroundColor:
                    i === state.index
                      ? palette.accent
                      : state.statuses[i] === "done"
                        ? palette.done
                        : palette.line,
                },
              ]}
            />
          ))}
        </View>
        <View style={styles.progressText}>
          <Text style={[styles.small, { color: palette.muted }]}>
            {doneCount} of {tasks.length} done
          </Text>
          <Text style={[styles.small, { color: palette.muted }]}>
            ~{Math.round(secondsLeft / 60)} min left
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} ref={scroll}>
        {task ? (
          <CurrentStep
            index={state.index}
            key={state.index}
            onFinalSeconds={ringGong}
            onFinish={complete}
            palette={palette}
            state={state}
            task={task}
          />
        ) : (
          <View
            style={[
              styles.card,
              styles.finished,
              { backgroundColor: palette.surface, borderColor: palette.line },
            ]}
          >
            <Text style={[styles.finishedTitle, { color: palette.ink }]}>Done</Text>
            <Text style={[styles.body, { color: palette.muted }]}>
              {doneCount} of {tasks.length} steps completed.
            </Text>
          </View>
        )}

        <View style={styles.listHead}>
          <Text style={[styles.listTitle, { color: palette.ink }]}>This session</Text>
          <Text style={[styles.small, { color: palette.muted }]}>Tap a step to jump</Text>
        </View>
        <View
          style={[styles.steps, { backgroundColor: palette.surface, borderColor: palette.line }]}
        >
          {tasks.map((t, i) => (
            <StepRow
              current={i === state.index}
              first={i === 0}
              key={i}
              onPress={() => dispatch({ index: i, type: "jump" })}
              palette={palette}
              status={state.statuses[i]}
              task={t}
            />
          ))}
        </View>
      </ScrollView>

      <View style={[styles.bottomBar, { borderColor: palette.line }]}>
        <SquareButton
          disabled={state.index === 0}
          label="Previous step"
          onPress={() => dispatch({ type: "back" })}
          palette={palette}
        >
          <PreviousIcon color={palette.muted} />
        </SquareButton>
        <PrimaryButton
          onPress={() => {
            if (!task) {
              // Going again is a new session; the finished one stays recorded
              session.current = newSession();
              recorded.current = false;
              dispatch({ type: "restart" });
            } else if (task.type === "Stretch") {
              dispatch({ now: Date.now(), type: "toggle" });
            } else {
              complete(Date.now());
            }
          }}
          palette={palette}
          state={state}
          task={task}
        />
        <SquareButton
          disabled={!task}
          label="Skip step"
          onPress={() => dispatch({ type: "skip" })}
          palette={palette}
        >
          <NextIcon color={palette.muted} />
        </SquareButton>
      </View>

      <Modal
        animationType="slide"
        onRequestClose={() => setShowInfo(false)}
        transparent
        visible={showInfo}
      >
        <Pressable
          accessibilityLabel="Close"
          onPress={() => setShowInfo(false)}
          style={[styles.backdrop, { backgroundColor: palette.backdrop }]}
        />
        <View style={[styles.sheet, { backgroundColor: palette.surface }]}>
          <View style={[styles.grip, { backgroundColor: palette.line }]} />
          <View style={styles.sheetHead}>
            <Text style={[styles.sheetTitle, { color: palette.ink }]}>{routine.name}</Text>
            <RoundButton label="Close" onPress={() => setShowInfo(false)} palette={palette}>
              <CloseIcon color={palette.muted} />
            </RoundButton>
          </View>
          <ScrollView contentContainerStyle={styles.sheetBody}>
            <Markdown
              palette={palette}
              text={routine.description || "No notes for this routine."}
            />
          </ScrollView>
        </View>
      </Modal>
    </Paper>
  );
}

function CurrentStep({
  index,
  onFinalSeconds,
  onFinish,
  palette,
  state,
  task,
}: {
  index: number;
  onFinalSeconds: () => void;
  onFinish: (at: number) => void;
  palette: Palette;
  state: SessionState;
  task: Task;
}) {
  const [showHowTo, setShowHowTo] = useState(false);
  const { code, family, title } = splitCode(task.name);
  const cue = keyCue(task.description);
  return (
    <View style={[styles.card, { backgroundColor: palette.surface, borderColor: palette.line }]}>
      <View style={styles.cardInner}>
        <View style={styles.meta}>
          {code && (
            <Text style={[styles.code, { borderColor: palette.line, color: palette.muted }]}>
              {code}
            </Text>
          )}
          <Text style={[styles.body, { color: palette.ink }]}>{family ?? `Step ${index + 1}`}</Text>
        </View>
        <Text style={[styles.title, { color: palette.ink }]}>{title}</Text>
        {(task.side || task.set) && (
          <View style={styles.tags}>
            {task.side && (
              <View style={styles.side}>
                <SideMark palette={palette} side={task.side} size={12} />
                <Text
                  style={[
                    styles.sideText,
                    { color: task.side === "Right" ? palette.ink : palette.muted },
                  ]}
                >
                  {task.side}
                </Text>
              </View>
            )}
            {task.set && task.sets && (
              <Text style={[styles.body, { color: palette.muted }]}>
                Set {task.set} of {task.sets}
              </Text>
            )}
          </View>
        )}
        {task.type === "Stretch" ? (
          <View style={styles.target}>
            <RingTimer
              durationMs={task.duration * 1000}
              endsAt={state.endsAt}
              onFinalSeconds={onFinalSeconds}
              onFinish={onFinish}
              palette={palette}
              remainingMs={state.remainingMs ?? task.duration * 1000}
              running={state.running}
            />
          </View>
        ) : (
          <RepsTarget palette={palette} repetitions={task.repetitions} />
        )}
        {cue && (
          <View
            style={[
              styles.cue,
              { backgroundColor: palette.accentSoft, borderColor: palette.accent },
            ]}
          >
            <Text style={[styles.body, { color: palette.ink }]}>
              <Text style={[styles.cueLabel, { color: palette.accent }]}>
                {cue.label.toUpperCase()}{" "}
              </Text>
              {cue.text.replaceAll("**", "")}
            </Text>
          </View>
        )}
      </View>
      {task.description ? (
        <View style={[styles.howTo, { borderColor: palette.line }]}>
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ expanded: showHowTo }}
            onPress={() => setShowHowTo(!showHowTo)}
            style={styles.howToHead}
          >
            <Text style={[styles.howToLabel, { color: palette.ink }]}>How to</Text>
            <Text style={[styles.howToLabel, { color: palette.muted }]}>
              {showHowTo ? "–" : "+"}
            </Text>
          </Pressable>
          {showHowTo && (
            <View style={styles.howToBody}>
              <Markdown palette={palette} text={task.description} />
            </View>
          )}
        </View>
      ) : (
        <View style={{ height: 14 }} />
      )}
    </View>
  );
}

function RepsTarget({ palette, repetitions }: { palette: Palette; repetitions: number | string }) {
  const [count, label] = repsParts(repetitions);
  return (
    <View style={styles.reps}>
      <Text style={[styles.repsNumber, { color: palette.ink }]}>{count}</Text>
      <Text style={[styles.small, styles.center, { color: palette.muted }]}>{label}</Text>
    </View>
  );
}

// A cinnabar seal marks the right side; the left gets an empty square
function SideMark({
  palette,
  side,
  size,
}: {
  palette: Palette;
  side: "Left" | "Right";
  size: number;
}) {
  return (
    <View
      style={{
        backgroundColor: side === "Right" ? palette.seal : "transparent",
        borderColor: palette.muted,
        borderRadius: size / 6,
        borderWidth: side === "Right" ? 0 : 1.5,
        height: size,
        width: size,
      }}
    />
  );
}

function StepRow({
  current,
  first,
  onPress,
  palette,
  status,
  task,
}: {
  current: boolean;
  first: boolean;
  onPress: () => void;
  palette: Palette;
  status: StepStatus;
  task: Task;
}) {
  const { code, title } = splitCode(task.name);
  const faded = !current && status != null;
  return (
    <Pressable
      accessibilityLabel={`${title}${task.side ? `, ${task.side} side` : ""}${task.set ? `, set ${task.set} of ${task.sets}` : ""}`}
      accessibilityRole="button"
      accessibilityState={{ selected: current }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.step,
        !first && { borderColor: palette.line, borderTopWidth: StyleSheet.hairlineWidth },
        pressed && { backgroundColor: palette.accentSoft },
      ]}
    >
      <View
        style={[
          styles.mark,
          { borderColor: palette.line },
          status === "done" && { backgroundColor: palette.done, borderColor: palette.done },
          status === "skipped" && { borderStyle: "dashed" },
          current && { backgroundColor: palette.accent, borderColor: palette.accent },
        ]}
      >
        {status === "done" && !current && <CheckIcon color={palette.surface} size={11} />}
      </View>
      <Text style={[styles.stepCode, { color: palette.muted }]}>{code ?? ""}</Text>
      <View style={styles.stepName}>
        <Text
          style={[
            styles.stepTitle,
            { color: current ? palette.accent : faded ? palette.muted : palette.ink },
            current && { fontFamily: fonts.bodyStrong },
          ]}
        >
          {title}
        </Text>
        {(task.side || task.set) && (
          <View style={styles.stepMeta}>
            {task.side && <SideMark palette={palette} side={task.side} size={8} />}
            {task.set && (
              <Text style={[styles.small, { color: palette.muted }]}>
                {task.set}/{task.sets}
              </Text>
            )}
          </View>
        )}
      </View>
      <Text style={[styles.small, styles.tabular, { color: palette.muted }]}>
        {shortTarget(task)}
      </Text>
    </Pressable>
  );
}

function PrimaryButton({
  onPress,
  palette,
  state,
  task,
}: {
  onPress: () => void;
  palette: Palette;
  state: SessionState;
  task: Task | undefined;
}) {
  let label = "Start over";
  let icon = null;
  const quiet = task?.type === "Stretch" && state.running;
  if (task?.type === "Stretch") {
    const started = state.running || (state.remainingMs ?? 0) < task.duration * 1000;
    label = state.running ? "Pause" : started ? "Resume" : "Start";
    icon = state.running ? (
      <PauseIcon color={palette.ink} />
    ) : (
      <PlayIcon color={palette.onAccent} />
    );
  } else if (task) {
    label = "Done";
    icon = <CheckIcon color={palette.onAccent} />;
  }
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.primary,
        quiet
          ? { backgroundColor: palette.surface, borderColor: palette.line, borderWidth: 1 }
          : { backgroundColor: palette.accent },
        pressed && { opacity: 0.85 },
      ]}
    >
      {icon}
      <Text style={[styles.primaryText, { color: quiet ? palette.ink : palette.onAccent }]}>
        {label}
      </Text>
    </Pressable>
  );
}

function RoundButton({
  children,
  label,
  onPress,
  palette,
}: {
  children: ReactNode;
  label: string;
  onPress: () => void;
  palette: Palette;
}) {
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      hitSlop={6}
      onPress={onPress}
      style={[styles.round, { backgroundColor: palette.surface, borderColor: palette.line }]}
    >
      {children}
    </Pressable>
  );
}

function SquareButton({
  children,
  disabled,
  label,
  onPress,
  palette,
}: {
  children: ReactNode;
  disabled: boolean;
  label: string;
  onPress: () => void;
  palette: Palette;
}) {
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.square,
        {
          backgroundColor: palette.surface,
          borderColor: palette.line,
          opacity: disabled ? 0.35 : 1,
        },
      ]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1 },
  body: { fontFamily: fonts.body, fontSize: 14, lineHeight: 22 },
  bottomBar: {
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: 12,
    paddingBottom: bottomInset,
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  card: {
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    marginHorizontal: 16,
    marginTop: 4,
  },
  cardInner: { gap: 14, paddingHorizontal: 20, paddingTop: 22 },
  center: { textAlign: "center" },
  code: {
    borderRadius: 4,
    borderWidth: StyleSheet.hairlineWidth,
    fontFamily: fonts.body,
    fontSize: 12,
    overflow: "hidden",
    paddingHorizontal: 7,
  },
  cue: { borderLeftWidth: 2, paddingHorizontal: 14, paddingVertical: 12 },
  cueLabel: { fontFamily: fonts.bodyStrong, fontSize: 11, letterSpacing: 1.6 },
  finished: {
    alignItems: "center",
    gap: 6,
    marginTop: 36,
    paddingHorizontal: 20,
    paddingVertical: 34,
  },
  finishedTitle: { fontFamily: fonts.display, fontSize: 26 },
  grip: { alignSelf: "center", borderRadius: 2, height: 4, marginBottom: 14, width: 40 },
  howTo: { borderTopWidth: StyleSheet.hairlineWidth, marginTop: 14 },
  howToBody: { paddingBottom: 16, paddingHorizontal: 20 },
  howToHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 13,
  },
  howToLabel: { fontFamily: fonts.bodyStrong, fontSize: 15 },
  listHead: {
    alignItems: "baseline",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 10,
    paddingHorizontal: 20,
    paddingTop: 26,
  },
  listTitle: { fontFamily: fonts.display, fontSize: 16 },
  mark: {
    alignItems: "center",
    borderRadius: 9,
    borderWidth: 1,
    height: 18,
    justifyContent: "center",
    width: 18,
  },
  meta: { alignItems: "center", flexDirection: "row", gap: 10 },
  primary: {
    alignItems: "center",
    borderRadius: 10,
    flex: 1,
    flexDirection: "row",
    gap: 8,
    height: 54,
    justifyContent: "center",
  },
  primaryText: { fontFamily: fonts.bodyStrong, fontSize: 16, letterSpacing: 0.6 },
  progress: { gap: 8, paddingBottom: 14, paddingHorizontal: 20 },
  progressText: { flexDirection: "row", justifyContent: "space-between" },
  reps: { alignItems: "center", gap: 4, paddingBottom: 12, paddingTop: 20 },
  repsNumber: {
    fontFamily: fonts.numeral,
    fontSize: 68,
    fontVariant: ["tabular-nums"],
    lineHeight: 78,
  },
  round: {
    alignItems: "center",
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  scrollContent: { paddingBottom: 24 },
  segment: { flex: 1 },
  segments: { flexDirection: "row", gap: 3, height: 3 },
  sheet: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    bottom: 0,
    left: 0,
    maxHeight: "75%",
    paddingBottom: bottomInset,
    paddingTop: 10,
    position: "absolute",
    right: 0,
  },
  sheetBody: { paddingBottom: 16, paddingHorizontal: 20 },
  sheetHead: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 10,
    paddingHorizontal: 20,
  },
  sheetTitle: { fontFamily: fonts.display, fontSize: 19 },
  side: { alignItems: "center", flexDirection: "row", gap: 8 },
  sideText: { fontFamily: fonts.bodyStrong, fontSize: 14, letterSpacing: 0.5 },
  small: { fontFamily: fonts.body, fontSize: 12 },
  square: {
    alignItems: "center",
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    height: 54,
    justifyContent: "center",
    width: 54,
  },
  step: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  stepCode: { fontFamily: fonts.body, fontSize: 11, width: 26 },
  stepMeta: { alignItems: "center", flexDirection: "row", gap: 6 },
  stepName: { alignItems: "center", columnGap: 7, flex: 1, flexDirection: "row", flexWrap: "wrap" },
  steps: {
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    marginHorizontal: 16,
    overflow: "hidden",
  },
  stepTitle: { fontFamily: fonts.body, fontSize: 14, lineHeight: 20 },
  tabular: { fontVariant: ["tabular-nums"] },
  tags: { alignItems: "center", flexDirection: "row", flexWrap: "wrap", gap: 12 },
  target: { paddingBottom: 6, paddingTop: 10 },
  title: { fontFamily: fonts.display, fontSize: 25, lineHeight: 33 },
  topBar: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    paddingBottom: 12,
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  topTitle: { flex: 1, fontFamily: fonts.display, fontSize: 15, textAlign: "center" },
});
