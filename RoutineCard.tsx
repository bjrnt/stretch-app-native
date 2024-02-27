import { Box, Heading } from '@gluestack-ui/themed'
import MarkdownWrapper from './MarkdownWrapper'

export default function RoutineCard({
  name,
  description,
}: {
  name: string
  description: string
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
      <Heading paddingLeft="$2" paddingBottom="$2">
        {name}
      </Heading>
      <Box
        bg="$backgroundDark950"
        padding="$2"
        paddingTop="$0"
        paddingBottom="$2"
        marginBottom="$2"
      >
        <MarkdownWrapper>{description}</MarkdownWrapper>
      </Box>
    </Box>
  )
}
