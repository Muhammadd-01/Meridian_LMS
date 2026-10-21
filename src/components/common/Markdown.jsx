import { Fragment } from 'react'
import { cn } from '../../utils/cn'

/** Inline formatting: **bold**, *italic* and `code`. Produces React nodes (no raw HTML). */
function renderInline(text, keyPrefix) {
  const parts = []
  const re = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g
  let last = 0
  let match
  let i = 0
  while ((match = re.exec(text))) {
    if (match.index > last) parts.push(text.slice(last, match.index))
    const token = match[0]
    const key = `${keyPrefix}-${i}`
    if (token.startsWith('**')) parts.push(<strong key={key}>{token.slice(2, -2)}</strong>)
    else if (token.startsWith('`')) parts.push(<code key={key}>{token.slice(1, -1)}</code>)
    else parts.push(<em key={key}>{token.slice(1, -1)}</em>)
    last = match.index + token.length
    i += 1
  }
  if (last < text.length) parts.push(text.slice(last))
  return parts
}

/** Renders the small Markdown subset used for lesson and assignment content. */
export default function Markdown({ content = '', className }) {
  const lines = String(content).replace(/\r\n/g, '\n').split('\n')
  const blocks = []
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    if (line.startsWith('```')) {
      const code = []
      i += 1
      while (i < lines.length && !lines[i].startsWith('```')) {
        code.push(lines[i])
        i += 1
      }
      i += 1
      blocks.push({ type: 'code', text: code.join('\n') })
    } else if (/^###\s/.test(line)) {
      blocks.push({ type: 'h3', text: line.replace(/^###\s/, '') })
      i += 1
    } else if (/^##\s/.test(line)) {
      blocks.push({ type: 'h2', text: line.replace(/^##\s/, '') })
      i += 1
    } else if (/^>\s?/.test(line)) {
      const quote = []
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        quote.push(lines[i].replace(/^>\s?/, ''))
        i += 1
      }
      blocks.push({ type: 'quote', text: quote.join(' ') })
    } else if (/^-\s/.test(line)) {
      const items = []
      while (i < lines.length && /^-\s/.test(lines[i])) {
        items.push(lines[i].replace(/^-\s/, ''))
        i += 1
      }
      blocks.push({ type: 'ul', items })
    } else if (/^\d+\.\s/.test(line)) {
      const items = []
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s/, ''))
        i += 1
      }
      blocks.push({ type: 'ol', items })
    } else if (line.trim() === '') {
      i += 1
    } else {
      const para = []
      while (i < lines.length && lines[i].trim() !== '' && !/^(##|```|>|-\s|\d+\.\s)/.test(lines[i])) {
        para.push(lines[i])
        i += 1
      }
      blocks.push({ type: 'p', text: para.join(' ') })
    }
  }

  return (
    <div className={cn('prose-meridian', className)}>
      {blocks.map((block, bi) => {
        const key = `b${bi}`
        switch (block.type) {
          case 'h2': return <h2 key={key}>{renderInline(block.text, key)}</h2>
          case 'h3': return <h3 key={key}>{renderInline(block.text, key)}</h3>
          case 'code': return <pre key={key}><code>{block.text}</code></pre>
          case 'quote': return <blockquote key={key}>{renderInline(block.text, key)}</blockquote>
          case 'ul': return <ul key={key}>{block.items.map((item, ii) => <li key={ii}>{renderInline(item, `${key}-${ii}`)}</li>)}</ul>
          case 'ol': return <ol key={key}>{block.items.map((item, ii) => <li key={ii}>{renderInline(item, `${key}-${ii}`)}</li>)}</ol>
          default: return <p key={key}>{renderInline(block.text, key).map((n, ni) => <Fragment key={ni}>{n}</Fragment>)}</p>
        }
      })}
    </div>
  )
}
