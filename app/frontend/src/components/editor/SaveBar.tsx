import { Button } from '@/components/ui/button'

interface SaveBarProps {
  mode: 'preview' | 'edit'
  onModeChange: (mode: 'preview' | 'edit') => void
  onSave: () => void
  isSaving: boolean
  mtime?: number
  path?: string
}

export function SaveBar({ mode, onModeChange, onSave, isSaving, mtime, path }: SaveBarProps) {
  const formatDate = (timestamp?: number) => {
    if (!timestamp) return ''
    try {
      const date = new Date(timestamp)
      return date.toLocaleString()
    } catch {
      return ''
    }
  }

  return (
    <div className="flex items-center justify-between border-b px-4 py-2 bg-background">
      <div className="flex items-center gap-2">
        <Button
          variant={mode === 'preview' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onModeChange('preview')}
        >
          預覽
        </Button>
        <Button
          variant={mode === 'edit' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onModeChange('edit')}
        >
          編輯
        </Button>
        {mode === 'edit' && (
          <Button
            variant="outline"
            size="sm"
            onClick={onSave}
            disabled={isSaving}
          >
            {isSaving ? '儲存中...' : '儲存'}
          </Button>
        )}
      </div>
      <div className="text-sm text-muted-foreground flex items-center gap-2">
        {path && <span className="font-mono">{path}</span>}
        {mtime && <span>最後修改: {formatDate(mtime)}</span>}
      </div>
    </div>
  )
}
