import { Box, Text } from '@gluestack-ui/themed'

export default function Timer(props: {
  duration: number
  millisecondsLeft: number
}) {
  const secondsLeft = Math.max(0, props.millisecondsLeft) / 1000
  const percentFull: any = `${
    (100 * (props.duration - secondsLeft)) / props.duration
  }%`
  const isFewSecondsLeft = props.millisecondsLeft < 3000
  const backgroundColor = isFewSecondsLeft ? '$orange500' : '$rose600'
  return (
    <Box h="$64" bg="$backgroundDark800">
      <Box h="$64" bg={backgroundColor} w={percentFull}></Box>
      <Box
        position="absolute"
        h="$64"
        w="100%"
        flex={1}
        alignItems="center"
        justifyContent="center"
      >
        <Text bold color="$textLight200">
          {secondsLeft.toFixed(1)} seconds left
        </Text>
      </Box>
    </Box>
  )
}
