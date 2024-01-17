import { Box, Text } from '@gluestack-ui/themed'
import { useEffect, useState } from 'react'

export default function Timer(props: {
  duration: number
  onExpire: () => void
  paused?: boolean
}) {
  const [millisecondsLeft, setMillisecondsLeft] = useState(
    props.duration * 1000
  )
  const [lastTickAt, setLastTickAt] = useState(Date.now())
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const elapsedMs = Date.now() - lastTickAt
      setLastTickAt(Date.now())

      if (props.paused) {
        return
      }

      if (elapsedMs > millisecondsLeft) {
        props.onExpire()
        setMillisecondsLeft(0)
      } else {
        setMillisecondsLeft(millisecondsLeft - elapsedMs)
      }
    })
    return () => {
      cancelAnimationFrame(id)
    }
  })
  const secondsLeft = Math.max(0, millisecondsLeft) / 1000
  const percentFull: any = `${
    (100 * (props.duration - secondsLeft)) / props.duration
  }%`
  const isFewSecondsLeft = millisecondsLeft < 3000
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
