// API 類型定義
export interface Project {
  id: string
  name: string
  rootPath: string
  createdAt: string // ISO
}

export type IndexNode =
  | { type: 'dir'; name: string; path: string; children: IndexNode[] }
  | { type: 'file'; name: string; path: string; size: number; mtime: number }

export interface FileContent {
  path: string
  content: string
  mtime: number
}

export interface IndexStatus {
  lastRefreshedAt: string
  version: number
  fileCount: number
}
