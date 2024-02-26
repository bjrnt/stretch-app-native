import { Icon, Link, LinkText, Text } from '@gluestack-ui/themed'
import { DotIcon } from 'lucide-react-native'
import { ReactNode } from 'react'
import Markdown, { RenderRules } from 'react-native-markdown-display'

const renderRules: RenderRules = {
  text: (node, children, parent, styles) => (
    <Text key={node.key}>{node.content}</Text>
  ),
  list_item: (node, children, parent, styles) => (
    <Text key={node.key}>
      <Icon as={DotIcon} /> {children}
    </Text>
  ),
  link: (node, children, parent, styles) => (
    <Link key={node.key} href={node.attributes.href}>
      <LinkText>{children}</LinkText>
    </Link>
  ),
}

const isDebugMode = false

const MarkdownWrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <Markdown debugPrintTree={isDebugMode} rules={renderRules}>
      {children}
    </Markdown>
  )
}

export default MarkdownWrapper
