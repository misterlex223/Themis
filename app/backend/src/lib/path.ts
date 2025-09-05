import { promises as fs } from 'fs'
import path from 'path'
import { Project } from '../types/contract'

export class FsError extends Error {
  code: string
  constructor(code: string, message: string) {
    super(message)
    this.code = code
  }
}

export function ensureMdPath(project: Project, relPath: string): string {
  if (!relPath) throw new FsError('invalid_argument', 'path required')
  // Normalize to posix-like, then resolve
  const normRel = relPath.replace(/\\/g, '/').replace(/^\/+/, '')
  const abs = path.resolve(project.rootPath, normRel)
  return abs
}

export async function validateInsideProject(project: Project, absPath: string): Promise<void> {
  const real = await fs.realpath(absPath).catch(() => absPath)
  const realRoot = await fs.realpath(project.rootPath).catch(() => project.rootPath)
  const inRoot = real === realRoot || real.startsWith(realRoot + path.sep)
  if (!inRoot) {
    throw new FsError('forbidden', 'path escapes project root')
  }
}

export function assertMarkdown(relPath: string) {
  const lower = relPath.toLowerCase()
  if (!lower.endsWith('.md')) throw new FsError('forbidden', 'only .md files are allowed')
}
