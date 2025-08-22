import { Box, Link, LinkText, Text } from '@gluestack-ui/themed'
import { ReactNode, memo } from 'react'
import Markdown, { RenderRules } from 'react-native-markdown-display'

const renderRules: RenderRules = {
  link: (node, children, parent, styles) => (
    <Link href={node.attributes.href} key={node.key}>
      <LinkText>{children}</LinkText>
    </Link>
  ),
  list_item: (node, children, parent, styles) => (
    <Text key={node.key}>- {children}</Text>
  ),
  text: (node, children, parent, styles) => (
    <Text key={node.key}>{node.content}</Text>
  ),
}

const isDebugMode = false

export default memo(function MarkdownWrapper({
  children,
}: {
  children: ReactNode
}) {
  return (
    <Box marginTop="$1">
      <Markdown debugPrintTree={isDebugMode} rules={renderRules}>
        {children}
      </Markdown>
    </Box>
  )
})
