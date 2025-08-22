import { Box, Text } from '@gluestack-ui/themed'
import { memo } from 'react'
import { DimensionValue } from 'react-native'

export default memo(function Timer(props: {
  duration: number
  millisecondsLeft: number
}) {
  const secondsLeft = Math.max(0, props.millisecondsLeft) / 1000
  const percentFull: DimensionValue = `${
    (100 * (props.duration - secondsLeft)) / props.duration
  }%`
  const isFewSecondsLeft = props.millisecondsLeft < 3000
  const backgroundColor = isFewSecondsLeft ? '$orange500' : '$rose600'
  return (
    <Box bg="$backgroundDark800" h="$64">
      <Box bg={backgroundColor} h="$64" w={percentFull}></Box>
      <Box
        alignItems="center"
        flex={1}
        h="$64"
        justifyContent="center"
        position="absolute"
        w="100%"
      >
        <Text bold color="$textLight200">
          {secondsLeft.toFixed(1)} seconds left
        </Text>
      </Box>
    </Box>
  )
})
