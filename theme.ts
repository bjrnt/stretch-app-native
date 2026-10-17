import { useColorScheme } from "react-native";

// A quiet Korean temple: hanji paper, meok ink, celadon for the main action
// and progress, a cinnabar seal for the right side.

const light = {
  accent: "#4e786d",
  accentSoft: "#e2ebe5",
  backdrop: "rgba(30, 24, 18, 0.3)",
  background: "#f1eee6",
  done: "#8aa59c",
  // Obangsaek, the five traditional colours, for the eave band
  eave: ["#36598a", "#a9402c", "#c49a3a", "#f4f1e8", "#2b2925"],
  ink: "#2b2925",
  line: "#e0dacd",
  muted: "#7a756c",
  onAccent: "#f7f5ee",
  seal: "#a9402c",
  surface: "#f9f7f1",
  textureOpacity: 0.5,
};

export type Palette = typeof light;

const dark: Palette = {
  accent: "#8fbaab",
  accentSoft: "#1f2a25",
  backdrop: "rgba(0, 0, 0, 0.5)",
  background: "#191915",
  done: "#6c8b80",
  eave: ["#36598a", "#a9402c", "#c49a3a", "#d9d4c7", "#0c0c0a"],
  ink: "#e8e4d9",
  line: "#302f29",
  muted: "#9c968a",
  onAccent: "#10201b",
  seal: "#d26a50",
  surface: "#21211c",
  textureOpacity: 0.12,
};

export function usePalette(): Palette {
  return useColorScheme() === "dark" ? dark : light;
}

export const fonts = {
  body: "GothicA1_400Regular",
  bodyStrong: "GothicA1_600SemiBold",
  display: "GowunBatang_700Bold",
  displayRegular: "GowunBatang_400Regular",
  numeral: "Hahmlet_200ExtraLight",
  numeralLight: "Hahmlet_300Light",
};

// Latin subsets of the Google Fonts (see assets/fonts for licences)
/* eslint-disable typescript-eslint/no-require-imports */
export const fontFiles = {
  [fonts.body]: require("./assets/fonts/GothicA1_400Regular.ttf"),
  [fonts.bodyStrong]: require("./assets/fonts/GothicA1_600SemiBold.ttf"),
  [fonts.display]: require("./assets/fonts/GowunBatang_700Bold.ttf"),
  [fonts.displayRegular]: require("./assets/fonts/GowunBatang_400Regular.ttf"),
  [fonts.numeral]: require("./assets/fonts/Hahmlet_200ExtraLight.ttf"),
  [fonts.numeralLight]: require("./assets/fonts/Hahmlet_300Light.ttf"),
};
/* eslint-enable typescript-eslint/no-require-imports */
