import { useState, useEffect } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { useIndex, useStatus, useFile, useRefresh, useSaveFile } from '@/lib/query'
import { toast } from 'sonner'
import { TopBar } from '@/components/core/TopBar'
import { TreeView } from '@/components/explorer/TreeView'
import { MarkdownViewer } from '@/components/editor/MarkdownViewer'
import { MarkdownEditor } from '@/components/editor/MarkdownEditor'
import { SaveBar } from '@/components/editor/SaveBar'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export default function WorkspacePage() {
  const { projectId } = useParams<{ projectId: string }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  
  const filePath = searchParams.get('path') || ''
  const mode = (searchParams.get('mode') as 'preview' | 'edit') || 'preview'
  
  const [content, setContent] = useState('')
  const [showConflictDialog, setShowConflictDialog] = useState(false)
  
  // 查詢
  const { data: indexData, isLoading: isLoadingIndex } = useIndex(projectId || '')
  const { data: statusData } = useStatus(projectId || '')
  const { 
    data: fileData, 
    isLoading: isLoadingFile,
    refetch: refetchFile
  } = useFile(projectId || '', filePath)
  
  // 變更
  const { mutate: refreshIndex, isPending: isRefreshing } = useRefresh()
  const { mutate: saveFile, isPending: isSaving } = useSaveFile()
  
  // 檔案內容同步
  useEffect(() => {
    if (fileData?.content) {
      setContent(fileData.content)
    }
  }, [fileData?.content])
  
  // 處理檔案選擇
  const handleSelectFile = (path: string) => {
    setSearchParams({ path, mode: 'preview' })
  }
  
  // 處理模式切換
  const handleModeChange = (newMode: 'preview' | 'edit') => {
    setSearchParams({ path: filePath, mode: newMode })
  }
  
  // 處理儲存
  const handleSave = () => {
    if (!projectId || !filePath) return
    
    saveFile(
      { 
        projectId, 
        path: filePath, 
        content, 
        baseMtime: fileData?.mtime 
      },
      {
        onSuccess: () => {
          toast.success('儲存成功')
        },
        onError: (error: any) => {
          if (error.message === 'conflict') {
            setShowConflictDialog(true)
          } else {
            toast.error(`儲存失敗: ${error.message}`)
          }
        }
      }
    )
  }
  
  // 處理刷新
  const handleRefresh = () => {
    if (!projectId) return
    refreshIndex(projectId, {
      onSuccess: () => {
        toast.success('索引刷新成功')
      },
      onError: () => {
        toast.error('索引刷新失敗')
      }
    })
  }
  
  // 處理衝突
  const handleReloadFile = () => {
    refetchFile()
    setShowConflictDialog(false)
  }
  
  if (!projectId) {
    navigate('/')
    return null
  }
  
  return (
    <div className="flex flex-col h-screen">
      <TopBar 
        projectId={projectId}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        lastRefreshed={statusData?.lastRefreshedAt}
        version={statusData?.version}
      />
      
      <div className="flex flex-1 overflow-hidden">
        {/* 左側樹狀瀏覽 */}
        <div className="w-64 border-r overflow-auto">
          {isLoadingIndex ? (
            <div className="p-4 text-center">
              <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">載入中...</p>
            </div>
          ) : indexData ? (
            <TreeView 
              data={indexData} 
              onSelectFile={handleSelectFile}
              selectedPath={filePath}
            />
          ) : (
            <div className="p-4 text-center">
              <p className="text-sm text-muted-foreground">尚未建立索引</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={handleRefresh}
              >
                刷新索引
              </Button>
            </div>
          )}
        </div>
        
        {/* 右側內容 */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {filePath ? (
            <>
              <SaveBar 
                mode={mode}
                onModeChange={handleModeChange}
                onSave={handleSave}
                isSaving={isSaving}
                mtime={fileData?.mtime}
                path={filePath}
              />
              
              <div className="flex-1 overflow-auto">
                {isLoadingFile ? (
                  <div className="p-4 text-center">
                    <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                    <p className="text-sm text-muted-foreground">載入檔案中...</p>
                  </div>
                ) : mode === 'preview' ? (
                  <MarkdownViewer content={content} />
                ) : (
                  <MarkdownEditor 
                    content={content} 
                    onChange={setContent}
                  />
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-lg font-medium">請從左側選擇檔案</p>
                <p className="text-sm text-muted-foreground mt-1">或按下頂部的「刷新」按鈕更新索引</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* 衝突對話框 */}
      <Dialog open={showConflictDialog} onOpenChange={setShowConflictDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>檔案已被外部修改</DialogTitle>
            <DialogDescription>
              此檔案已被外部程式修改，若要繼續編輯，請先重新載入最新內容。
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowConflictDialog(false)}>
              取消
            </Button>
            <Button onClick={handleReloadFile}>
              重新載入
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
