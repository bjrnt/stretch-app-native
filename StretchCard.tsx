import { Box, Text, Heading } from '@gluestack-ui/themed'
import Timer from './Timer'
import React, { memo } from 'react'
import MarkdownWrapper from './MarkdownWrapper'

export default memo(function StretchCard(props: {
  description: string
  duration: number
  isNext: boolean
  millisecondsLeft?: number
  name: string
}) {
  return (
    <Box>
      <Box paddingLeft="$2" paddingRight="$2">
        <Heading color="$textLight200">{props.name}</Heading>
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
        <Timer
          duration={props.duration}
          millisecondsLeft={props.millisecondsLeft}
        />
      )}
    </Box>
  )
})
