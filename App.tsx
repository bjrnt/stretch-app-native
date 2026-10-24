import { useFonts } from "expo-font";
import { useKeepAwake } from "expo-keep-awake";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { BackHandler, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import HomeScreen from "./HomeScreen";
import { RoutineKey } from "./Library";
import { useLog } from "./Log";
import SessionScreen from "./SessionScreen";
import { fontFiles, usePalette } from "./theme";

export default function App() {
  const palette = usePalette();
  const [fontsLoaded] = useFonts(fontFiles);
  const [open, setOpen] = useState<RoutineKey | null>(null);
  const [last, setLast] = useState<RoutineKey | null>(null);
  const { record, records } = useLog();

  // Prevent the screen from sleeping
  useKeepAwake();

  // Android back button returns from a session to the routine list
  useEffect(() => {
    if (!open) {
      return;
    }
    const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
      setOpen(null);
      return true;
    });
    return () => subscription.remove();
  }, [open]);

  if (!fontsLoaded) {
    return <View style={{ backgroundColor: palette.background, flex: 1 }} />;
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      {open ? (
        <SessionScreen
          key={open}
          onClose={() => setOpen(null)}
          onRecord={record}
          palette={palette}
          routineKey={open}
        />
      ) : (
        <HomeScreen
          current={last}
          onSelect={(key) => {
            setLast(key);
            setOpen(key);
          }}
          palette={palette}
          records={records}
        />
      )}
    </SafeAreaProvider>
  );
}
