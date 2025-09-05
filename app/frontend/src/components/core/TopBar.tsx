import { useNavigate } from 'react-router-dom'
import { useProjects } from '@/lib/query'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface TopBarProps {
  projectId: string
  onRefresh: () => void
  isRefreshing: boolean
  lastRefreshed?: string
  version?: number
}

export function TopBar({ projectId, onRefresh, isRefreshing, lastRefreshed, version }: TopBarProps) {
  const navigate = useNavigate()
  const { data: projects } = useProjects()

  const handleProjectChange = (value: string) => {
    navigate(`/p/${value}`)
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '尚未刷新'
    try {
      const date = new Date(dateStr)
      return date.toLocaleString()
    } catch {
      return dateStr
    }
  }

  return (
    <div className="flex items-center justify-between border-b px-4 py-2">
      <div className="flex items-center gap-4">
        <Select value={projectId} onValueChange={handleProjectChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="選擇專案" />
          </SelectTrigger>
          <SelectContent>
            {projects?.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRefresh}
          disabled={isRefreshing}
        >
          {isRefreshing ? (
            <>
              <span className="animate-spin mr-2">⟳</span>
              刷新中...
            </>
          ) : (
            <>刷新</>
          )}
        </Button>
      </div>
      
      <div className="text-sm text-muted-foreground">
        {version !== undefined && (
          <span className="mr-4">版本: {version}</span>
        )}
        {lastRefreshed && (
          <span>最後更新: {formatDate(lastRefreshed)}</span>
        )}
      </div>
    </div>
  )
}
