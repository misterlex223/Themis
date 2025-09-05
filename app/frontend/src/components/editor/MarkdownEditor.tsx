import { useRef, useEffect } from 'react'

interface MarkdownEditorProps {
  content: string
  onChange: (content: string) => void
  className?: string
}

export function MarkdownEditor({ content, onChange, className }: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+S 或 Cmd+S 儲存
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        // 儲存事件由父元件處理
      }
    }

    const textarea = textareaRef.current
    if (textarea) {
      textarea.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      if (textarea) {
        textarea.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [])

  return (
    <textarea
      ref={textareaRef}
      value={content}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full h-full p-4 font-mono text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary ${className}`}
      spellCheck={false}
    />
  )
}
