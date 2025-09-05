import { promises as fs } from 'fs'
import path from 'path'
import { FileContent, Project } from '../types/contract'
import { FsError, assertMarkdown, ensureMdPath, validateInsideProject } from '../lib/path'
import { updateFileNode } from './indexer'

export async function readMarkdownFile(project: Project, relPath: string): Promise<FileContent> {
  assertMarkdown(relPath)
  const abs = ensureMdPath(project, relPath)
  await validateInsideProject(project, abs)
  let data: string
  try {
    data = await fs.readFile(abs, 'utf8')
  } catch (err: any) {
    if (err && err.code === 'ENOENT') throw new FsError('not_found', 'file not found')
    throw new FsError('io_error', 'failed to read file')
  }
  const st = await fs.stat(abs)
  return { path: relPath, content: data, mtime: st.mtimeMs }
}

export async function writeMarkdownFile(
  project: Project,
  params: { path: string; content: string; baseMtime?: number }
): Promise<{ mtime: number }> {
  assertMarkdown(params.path)
  const abs = ensureMdPath(project, params.path)
  await validateInsideProject(project, abs)

  const dir = path.dirname(abs)
  await fs.mkdir(dir, { recursive: true })

  const st = await fs.stat(abs).catch(() => null)
  if (params.baseMtime != null && st && Math.floor(st.mtimeMs) !== Math.floor(params.baseMtime)) {
    throw new FsError('conflict', 'file modified by others')
  }

  try {
    await fs.writeFile(abs, params.content, 'utf8')
  } catch {
    throw new FsError('io_error', 'failed to write file')
  }
  const newStat = await fs.stat(abs)
  updateFileNode(project.id, params.path.replace(/\\/g, '/'), newStat.size, newStat.mtimeMs)
  return { mtime: newStat.mtimeMs }
}
