import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProjects } from '@/lib/query'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'

export default function HomePage() {
  const navigate = useNavigate()
  const { data: projects, isLoading, error } = useProjects()
  const [selectedProject, setSelectedProject] = useState<string>('')

  const handleSelectProject = (value: string) => {
    setSelectedProject(value)
  }

  const handleEnterProject = () => {
    if (!selectedProject) {
      toast.error('請選擇一個專案')
      return
    }
    navigate(`/p/${selectedProject}`)
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">載入專案中...</h2>
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">載入專案失敗</h2>
          <p className="text-muted-foreground mb-4">請確認後端服務是否正常運行</p>
          <Button onClick={() => window.location.reload()}>重試</Button>
        </div>
      </div>
    )
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <h2 className="text-2xl font-semibold mb-4">沒有可用的專案</h2>
          <p className="text-muted-foreground mb-4">
            請確認是否已設定 PROJECTS_JSON 環境變數，或在 Docker 啟動時掛載專案目錄
          </p>
          <div className="bg-muted p-4 rounded-md text-left text-sm mb-4">
            <pre className="whitespace-pre-wrap">
              {`docker run --rm -p 8080:8080 \\
  -v /Users/me/Notes:/app/workspaces/notes \\
  -e PROJECTS_JSON='[{"id":"notes","name":"Notes","rootPath":"/app/workspaces/notes"}]' \\
  markdown-app:latest`}
            </pre>
          </div>
          <Button onClick={() => window.location.reload()}>重新整理</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md p-6 space-y-6">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold">Markdown 瀏覽與編輯器</h1>
          <p className="text-muted-foreground mt-2">選擇一個專案開始</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="project-select" className="text-sm font-medium">
              專案
            </label>
            <Select value={selectedProject} onValueChange={handleSelectProject}>
              <SelectTrigger id="project-select">
                <SelectValue placeholder="選擇專案" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button 
            className="w-full" 
            onClick={handleEnterProject}
            disabled={!selectedProject}
          >
            進入專案
          </Button>
        </div>
      </div>
    </div>
  )
}
