import { Box, Text, Heading } from '@gluestack-ui/themed'
import React, { memo } from 'react'
import MarkdownWrapper from './MarkdownWrapper'

export default memo(function ExerciseCard(props: {
  description: string
  isNext: boolean
  name: string
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
          marginBottom="$2"
          padding="$2"
          paddingBottom="$2"
          paddingTop="$0"
        >
          <MarkdownWrapper>{props.description}</MarkdownWrapper>
        </Box>
      )}
    </Box>
  )
})
