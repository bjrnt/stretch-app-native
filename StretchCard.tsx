import { Box, Text, Heading } from '@gluestack-ui/themed'
import Stretch from './Stretch'
import Timer from './Timer'
import React, { memo } from 'react'

export default memo(function StretchCard(props: {
  isNextStretch: boolean
  stretch: Stretch
  millisecondsLeft?: number
}) {
  return (
    <Box
      paddingTop="$2"
      paddingBottom="$2"
      bg="$backgroundDark900"
      borderRadius="$lg"
      borderColor="$borderDark800"
      borderWidth="$1"
    >
      <Box paddingLeft="$2">
        <Heading color="$textLight200">{props.stretch.name}</Heading>
        {props.stretch.description && <Text>{props.stretch.description}</Text>}
        <Text marginBottom="$2" opacity="$80">
          Hold for {props.stretch.duration} seconds.
        </Text>
      </Box>
      {props.millisecondsLeft && (
        <Timer
          duration={props.stretch.duration}
          millisecondsLeft={props.millisecondsLeft}
        />
      )}
    </Box>
  )
})
