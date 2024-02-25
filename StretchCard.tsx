import { Box, Text, Heading } from '@gluestack-ui/themed'
import Timer from './Timer'
import React, { memo } from 'react'

export default memo(function StretchCard(props: {
  isNextStretch: boolean
  name: string
  description: string
  duration: number
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
        <Heading color="$textLight200">{props.name}</Heading>
        {props.description && <Text>{props.description}</Text>}
        <Text marginBottom="$2" opacity="$80">
          Hold for {props.duration} seconds.
        </Text>
      </Box>
      {props.millisecondsLeft && (
        <Timer
          duration={props.duration}
          millisecondsLeft={props.millisecondsLeft}
        />
      )}
    </Box>
  )
})
