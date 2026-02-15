/**
 * Extracts plain text from Payload CMS Lexical rich text JSON.
 * Handles both string values and Lexical JSON objects.
 */
export function extractTextFromLexical(value: unknown): string {
  if (typeof value === 'string') {
    return value
  }
  if (!value || typeof value !== 'object') {
    return ''
  }

  const obj = value as Record<string, unknown>

  // Lexical root structure: { root: { children: [...] } }
  const root = obj.root as Record<string, unknown> | undefined
  if (!root?.children || !Array.isArray(root.children)) {
    return ''
  }

  return extractTextFromChildren(root.children)
}

function extractTextFromChildren(children: unknown[]): string {
  let text = ''
  for (const child of children) {
    if (!child || typeof child !== 'object') continue
    const node = child as Record<string, unknown>
    if (node.type === 'text' && typeof node.text === 'string') {
      text += node.text
    }
    if (Array.isArray(node.children)) {
      text += extractTextFromChildren(node.children)
    }
  }
  return text
}
