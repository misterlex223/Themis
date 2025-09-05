// API 客戶端
import { Project, IndexNode, IndexStatus, FileContent } from '@/types/api'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080'

// 通用 API 請求函數
async function fetchApi<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${path}`
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'API request failed')
  }

  if (!data.success) {
    throw new Error(data.error || 'API request failed')
  }

  return data.data
}

// API 函數
export async function getProjects(): Promise<Project[]> {
  return fetchApi<Project[]>('/api/projects')
}

export async function refresh(projectId: string): Promise<IndexStatus> {
  return fetchApi<IndexStatus>(`/api/projects/${projectId}/refresh`, {
    method: 'POST',
  })
}

export async function getIndex(projectId: string, path?: string): Promise<IndexNode> {
  const query = path ? `?path=${encodeURIComponent(path)}` : ''
  return fetchApi<IndexNode>(`/api/projects/${projectId}/index${query}`)
}

export async function getStatus(projectId: string): Promise<IndexStatus> {
  return fetchApi<IndexStatus>(`/api/projects/${projectId}/status`)
}

export async function getFile(projectId: string, path: string): Promise<FileContent> {
  return fetchApi<FileContent>(`/api/projects/${projectId}/file?path=${encodeURIComponent(path)}`)
}

export async function saveFile(
  projectId: string,
  params: { path: string; content: string; baseMtime?: number }
): Promise<{ mtime: number }> {
  return fetchApi<{ mtime: number }>(`/api/projects/${projectId}/file`, {
    method: 'PUT',
    body: JSON.stringify(params),
  })
}
