import { promises as fs } from 'fs'
import path from 'path'
import { Project, IndexNode, IndexStatus } from '../types/contract'
import { getEnv } from '../lib/env'

interface CacheEntry {
  tree: IndexNode
  status: IndexStatus
  lock: Promise<void> | null
}

const cache = new Map<string, CacheEntry>()

function isIgnored(dirName: string): boolean {
  const env = getEnv()
  const defaults = ['.git', 'node_modules', 'dist', 'build', '.next', '.cache']
  const extra = (env.IGNORE_DIRS ?? '')
    .split(',')
    .map((s: string) => s.trim())
    .filter(Boolean)
  const set = new Set([...defaults, ...extra])
  return set.has(dirName)
}

async function statSafe(p: string) {
  try {
    return await fs.stat(p)
  } catch {
    return null
  }
}

async function scanDir(root: string, rel = ''): Promise<IndexNode> {
  const abs = path.resolve(root, rel)
  const entries = await fs.readdir(abs, { withFileTypes: true })
  const dirs: string[] = []
  const files: string[] = []
  for (const e of entries) {
    if (e.isDirectory()) {
      if (!isIgnored(e.name)) dirs.push(e.name)
    } else if (e.isFile()) {
      if (e.name.toLowerCase().endsWith('.md')) files.push(e.name)
    }
  }
  const children: IndexNode[] = []
  // Directories first
  for (const d of dirs.sort()) {
    const childRel = rel ? `${rel}/${d}` : d
    const child = await scanDir(root, childRel)
    // 只加入有內容的資料夾（若資料夾沒有任何 .md 子孫，可選擇忽略；初版保留目錄節點）
    children.push(child)
  }
  for (const f of files.sort()) {
    const fileRel = rel ? `${rel}/${f}` : f
    const st = await statSafe(path.resolve(root, fileRel))
    if (!st) continue
    children.push({ type: 'file', name: f, path: fileRel, size: st.size, mtime: st.mtimeMs })
  }
  const name = rel ? path.basename(rel) : ''
  return { type: 'dir', name, path: rel, children }
}

export async function refreshIndex(project: Project): Promise<IndexStatus> {
  let entry = cache.get(project.id)
  if (!entry) {
    entry = { tree: { type: 'dir', name: '', path: '', children: [] }, status: { lastRefreshedAt: '', version: 0, fileCount: 0 }, lock: null }
    cache.set(project.id, entry)
  }
  // Prevent concurrent refreshes
  if (entry.lock) return entry.status
  entry.lock = (async () => {
    const tree = await scanDir(project.rootPath)
    const count = countFiles(tree)
    entry!.tree = tree
    entry!.status = {
      lastRefreshedAt: new Date().toISOString(),
      version: (entry!.status.version ?? 0) + 1,
      fileCount: count,
    }
  })()
  try {
    await entry.lock
  } finally {
    entry.lock = null
  }
  return entry.status
}

function countFiles(node: IndexNode): number {
  if (node.type === 'file') return 1
  return node.children.reduce((acc, c) => acc + countFiles(c), 0)
}

export function getIndexTree(projectId: string): IndexNode | null {
  const entry = cache.get(projectId)
  return entry?.tree ?? null
}

export function getIndexStatus(projectId: string): IndexStatus | null {
  const entry = cache.get(projectId)
  return entry?.status ?? null
}

export function updateFileNode(projectId: string, fileRelPath: string, size: number, mtime: number) {
  const entry = cache.get(projectId)
  if (!entry) return
  const parts = fileRelPath.split('/').filter(Boolean)
  let node: IndexNode = entry.tree
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i]
    if (node.type !== 'dir') return
    const next = node.children.find((c) => c.type === 'dir' && c.name === part)
    if (!next) return
    node = next
  }
  if (node.type !== 'dir') return
  const fname = parts[parts.length - 1]
  let fileNode = node.children.find((c) => c.type === 'file' && c.name === fname)
  if (!fileNode) {
    // create if not exists
    fileNode = { type: 'file', name: fname, path: fileRelPath, size, mtime }
    node.children.push(fileNode)
  } else {
    ;(fileNode as any).size = size
    ;(fileNode as any).mtime = mtime
  }
  entry.status.fileCount = countFiles(entry.tree)
}
