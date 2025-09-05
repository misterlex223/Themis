// React Query hooks
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as api from './api'

// 專案查詢
export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: api.getProjects,
  })
}

// 索引查詢
export function useIndex(projectId: string, path?: string) {
  return useQuery({
    queryKey: ['index', projectId, path],
    queryFn: () => api.getIndex(projectId, path),
    enabled: !!projectId,
  })
}

// 索引狀態查詢
export function useStatus(projectId: string) {
  return useQuery({
    queryKey: ['status', projectId],
    queryFn: () => api.getStatus(projectId),
    enabled: !!projectId,
  })
}

// 檔案查詢
export function useFile(projectId: string, path: string) {
  return useQuery({
    queryKey: ['file', projectId, path],
    queryFn: () => api.getFile(projectId, path),
    enabled: !!projectId && !!path,
  })
}

// 儲存檔案
export function useSaveFile() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ projectId, path, content, baseMtime }: { 
      projectId: string
      path: string
      content: string
      baseMtime?: number
    }) => api.saveFile(projectId, { path, content, baseMtime }),
    onSuccess: (_, { projectId, path }) => {
      queryClient.invalidateQueries({ queryKey: ['file', projectId, path] })
    },
  })
}

// 刷新索引
export function useRefresh() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (projectId: string) => api.refresh(projectId),
    onSuccess: (_, projectId) => {
      queryClient.invalidateQueries({ queryKey: ['index', projectId] })
      queryClient.invalidateQueries({ queryKey: ['status', projectId] })
    },
  })
}
