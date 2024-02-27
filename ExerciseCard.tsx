import { Box, Text, Heading } from '@gluestack-ui/themed'
import React from 'react'
import MarkdownWrapper from './MarkdownWrapper'

export default function ExerciseCard(props: {
  isNext: boolean
  name: string
  description: string
  repetitions: number
}) {
  return (
    <Box>
      <Box paddingLeft="$2" paddingRight="$2">
        <Heading color="$textLight200">{props.name}</Heading>
        <Text marginBottom="$2" opacity="$80">
          Complete {props.repetitions} repetitions.
        </Text>
      </Box>
      {props.description && (
        <Box
          bg="$backgroundDark950"
          padding="$2"
          paddingTop="$0"
          paddingBottom="$2"
          marginBottom="$2"
        >
          <MarkdownWrapper>{props.description}</MarkdownWrapper>
        </Box>
      )}
    </Box>
  )
}
