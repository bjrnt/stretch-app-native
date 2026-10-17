import { useEffect, useRef, useState } from "react";
import { AccessibilityInfo, Animated, Easing, StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { formatClock } from "./Session";
import { fonts, Palette } from "./theme";

const size = 200;
const radius = 88;
const circumference = 2 * Math.PI * radius;

// Counts down the current hold. Runs its own frame loop so the rest of the
// session screen only re-renders when the step changes.
export default function RingTimer({
  durationMs,
  endsAt,
  onFinalSeconds,
  onFinish,
  palette,
  remainingMs,
  running,
}: {
  durationMs: number;
  endsAt: number | null;
  onFinalSeconds: () => void;
  onFinish: (at: number) => void;
  palette: Palette;
  remainingMs: number;
  running: boolean;
}) {
  const [now, setNow] = useState(() => Date.now());
  const previousLeft = useRef<number | null>(null);
  const breath = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!running || endsAt == null) {
      previousLeft.current = null;
      return;
    }
    let frame = requestAnimationFrame(function tick() {
      const time = Date.now();
      const left = endsAt - time;
      // The gong starts 3 s early so it rings out as the hold ends
      if (previousLeft.current != null && previousLeft.current > 3000 && left <= 3000) {
        onFinalSeconds();
      }
      previousLeft.current = left;
      if (left <= 0) {
        onFinish(endsAt);
        return;
      }
      setNow(time);
      frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, [running, endsAt, onFinish, onFinalSeconds]);

  // The ring slowly breathes while a hold runs, about 11 seconds per breath
  useEffect(() => {
    if (!running) {
      breath.stopAnimation();
      Animated.timing(breath, { duration: 600, toValue: 0, useNativeDriver: true }).start();
      return;
    }
    let loop: Animated.CompositeAnimation | null = null;
    AccessibilityInfo.isReduceMotionEnabled().then((reduce) => {
      if (reduce) {
        return;
      }
      const ease = Easing.inOut(Easing.sin);
      loop = Animated.loop(
        Animated.sequence([
          Animated.timing(breath, {
            duration: 5000,
            easing: ease,
            toValue: 1,
            useNativeDriver: true,
          }),
          Animated.timing(breath, {
            duration: 6000,
            easing: ease,
            toValue: 0,
            useNativeDriver: true,
          }),
        ]),
      );
      loop.start();
    });
    return () => loop?.stop();
  }, [running, breath]);

  const left = Math.min(
    durationMs,
    running && endsAt != null ? Math.max(0, endsAt - now) : remainingMs,
  );
  const progress = 1 - left / durationMs;
  const scale = breath.interpolate({ inputRange: [0, 1], outputRange: [0.97, 1.03] });

  return (
    <View
      accessibilityLabel={`${formatClock(left)} left of ${formatClock(durationMs)}`}
      accessibilityRole="timer"
      style={styles.ring}
    >
      {/* Rotated so the arc starts at the top */}
      <Animated.View
        style={[StyleSheet.absoluteFill, { transform: [{ rotate: "-90deg" }, { scale }] }]}
      >
        <Svg height={size} viewBox={`0 0 ${size} ${size}`} width={size}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            fill="none"
            r={radius}
            stroke={palette.line}
            strokeWidth={2}
          />
          <Circle
            cx={size / 2}
            cy={size / 2}
            fill="none"
            r={radius}
            stroke={palette.accent}
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={circumference * progress}
            strokeLinecap="round"
            strokeWidth={3}
          />
        </Svg>
      </Animated.View>
      <Text style={[styles.clock, { color: palette.ink }]}>{formatClock(left)}</Text>
      <Text style={[styles.sub, { color: palette.muted }]}>of {formatClock(durationMs)} hold</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  clock: { fontFamily: fonts.numeral, fontSize: 60, fontVariant: ["tabular-nums"], lineHeight: 70 },
  ring: {
    alignItems: "center",
    alignSelf: "center",
    height: size,
    justifyContent: "center",
    width: size,
  },
  sub: { fontFamily: fonts.body, fontSize: 12 },
});
