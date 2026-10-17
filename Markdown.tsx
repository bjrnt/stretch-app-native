import { memo, ReactNode } from "react";
import { Linking, StyleSheet, Text, View } from "react-native";
import { fonts, Palette } from "./theme";

// Renders the small Markdown subset used in routine descriptions:
// paragraphs, "-" and "1." lists, **bold**, _italic_ and [links](https://...).

type Block =
  | { lines: Array<string>; type: "paragraph" }
  | { items: Array<string>; type: "bullets" | "numbers" };

function parseBlocks(source: string): Array<Block> {
  const blocks: Array<Block> = [];
  let current = null as Block | null;
  for (const raw of source.split("\n")) {
    const line = raw.trim();
    const item = line.match(/^(-|\d+\.) (.*)$/);
    if (item) {
      const type = item[1] === "-" ? "bullets" : "numbers";
      if (current?.type !== type) {
        current = { items: [], type };
        blocks.push(current);
      }
      current.items.push(item[2]);
    } else if (line === "") {
      current = null;
    } else if (current?.type === "paragraph") {
      current.lines.push(line);
    } else {
      current = { lines: [line], type: "paragraph" };
      blocks.push(current);
    }
  }
  return blocks;
}

function renderInline(text: string, palette: Palette): Array<ReactNode> {
  const parts = text.split(/(\*\*[^*]+\*\*|\b_[^_]+_\b|\[[^\]]+\]\(https?:[^)\s]+\))/);
  return parts.map((part, i) => {
    if (part.startsWith("**")) {
      return (
        <Text key={i} style={{ fontFamily: fonts.bodyStrong }}>
          {part.slice(2, -2)}
        </Text>
      );
    }
    if (part.startsWith("_") && part.endsWith("_")) {
      return (
        <Text key={i} style={{ fontStyle: "italic" }}>
          {part.slice(1, -1)}
        </Text>
      );
    }
    const link = part.match(/^\[([^\]]+)\]\((.+)\)$/);
    if (link) {
      return (
        <Text
          accessibilityRole="link"
          key={i}
          onPress={() => Linking.openURL(link[2])}
          style={{ color: palette.accent, textDecorationLine: "underline" }}
        >
          {link[1]}
        </Text>
      );
    }
    return part;
  });
}

export default memo(function Markdown({ palette, text }: { palette: Palette; text: string }) {
  const textStyle = [styles.text, { color: palette.ink }];
  return (
    <View style={styles.blocks}>
      {parseBlocks(text).map((block, i) =>
        block.type === "paragraph" ? (
          <Text key={i} style={textStyle}>
            {renderInline(block.lines.join("\n"), palette)}
          </Text>
        ) : (
          <View key={i} style={styles.list}>
            {block.items.map((item, j) => (
              <View key={j} style={styles.item}>
                <Text style={[textStyle, styles.marker, { color: palette.muted }]}>
                  {block.type === "numbers" ? `${j + 1}.` : "•"}
                </Text>
                <Text style={[textStyle, styles.itemText]}>{renderInline(item, palette)}</Text>
              </View>
            ))}
          </View>
        ),
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  blocks: { gap: 10 },
  item: { flexDirection: "row", gap: 6 },
  itemText: { flex: 1 },
  list: { gap: 4 },
  marker: { fontVariant: ["tabular-nums"], minWidth: 16 },
  text: { fontFamily: fonts.body, fontSize: 14, lineHeight: 22 },
});
