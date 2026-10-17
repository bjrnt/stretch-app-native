import Constants from "expo-constants";
import { ReactNode } from "react";
import { Image, StyleSheet, View } from "react-native";
import { Palette } from "./theme";

// eslint-disable-next-line typescript-eslint/no-require-imports
const hanji = require("./assets/hanji.png");

export const topInset = Constants.statusBarHeight;
// No safe-area module in the native build, so leave room for the home indicator
export const bottomInset = 24;

// Screen background: hanji paper with faint fibres, under a band of the five
// traditional colours like painted temple eaves.
export default function Paper({ children, palette }: { children: ReactNode; palette: Palette }) {
  return (
    <View style={[styles.root, { backgroundColor: palette.background }]}>
      <Image
        resizeMode="repeat"
        source={hanji}
        style={[
          StyleSheet.absoluteFill,
          { height: "100%", opacity: palette.textureOpacity, width: "100%" },
        ]}
      />
      <View style={[styles.eave, { marginTop: topInset }]}>
        {palette.eave.map((color) => (
          <View key={color} style={[styles.eaveBand, { backgroundColor: color }]} />
        ))}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  eave: { flexDirection: "row", height: 5, opacity: 0.85 },
  eaveBand: { flex: 1 },
  root: { flex: 1 },
});
