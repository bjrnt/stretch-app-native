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
      padding="$2"
      bg="$backgroundDark900"
      borderRadius="$lg"
      borderColor="$borderDark800"
      borderWidth="$1"
    >
      <Heading>{name}</Heading>
      <MarkdownWrapper>{description}</MarkdownWrapper>
    </Box>
  )
}
