import { Box, Heading } from '@gluestack-ui/themed'
import MarkdownWrapper from './MarkdownWrapper'
import { memo } from 'react'

export default memo(function RoutineCard({
  description,
  name,
}: {
  description: string
  name: string
}) {
  return (
    <Box
      bg="$backgroundDark900"
      borderColor="$borderDark800"
      borderRadius="$lg"
      borderWidth="$1"
      paddingBottom="$2"
      paddingTop="$2"
    >
      <Heading paddingBottom="$2" paddingLeft="$2">
        {name}
      </Heading>
      <Box
        bg="$backgroundDark950"
        marginBottom="$2"
        padding="$2"
        paddingBottom="$2"
        paddingTop="$0"
      >
        <MarkdownWrapper>{description}</MarkdownWrapper>
      </Box>
    </Box>
  )
})
