import { Box, Text, Heading, HStack } from "@gluestack-ui/themed";
import Timer from "./Timer";
import React, { memo } from "react";
import MarkdownWrapper from "./MarkdownWrapper";
import { PauseCircleIcon } from "lucide-react-native";

export default memo(function StretchCard(props: {
  description: string;
  duration: number;
  isNext: boolean;
  millisecondsLeft?: number;
  name: string;
  pauseAfter?: boolean;
}) {
  return (
    <Box>
      <Box paddingLeft="$2" paddingRight="$2">
        <HStack alignItems="center" justifyContent="space-between">
          <Heading color="$textLight200">{props.name}</Heading>
          {props.pauseAfter && <PauseCircleIcon color="gray" opacity={0.6} size={20} />}
        </HStack>
        <Text marginBottom="$2" opacity="$80">
          Hold for {props.duration} seconds.
        </Text>
      </Box>
      {props.description && (
        <Box
          bg="$backgroundDark950"
          marginBottom="$2"
          padding="$2"
          paddingBottom="$2"
          paddingTop="$0"
        >
          <MarkdownWrapper>{props.description}</MarkdownWrapper>
        </Box>
      )}
      {props.millisecondsLeft && (
        <Timer duration={props.duration} millisecondsLeft={props.millisecondsLeft} />
      )}
    </Box>
  );
});
