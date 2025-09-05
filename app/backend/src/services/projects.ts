import { getEnv } from '../lib/env'
import { Project } from '../types/contract'

let cached: Project[] | null = null

export function listProjects(): Project[] {
  if (cached) return cached
  const env = getEnv()
  const now = new Date().toISOString()
  try {
    const arr = env.PROJECTS_JSON ? (JSON.parse(env.PROJECTS_JSON) as any[]) : []
    cached = arr.map((p) => ({
      id: String(p.id),
      name: String(p.name ?? p.id),
      rootPath: String(p.rootPath),
      createdAt: p.createdAt ? String(p.createdAt) : now,
    }))
  } catch {
    cached = []
  }
  return cached
}

export function getProjectById(id: string): Project | undefined {
  return listProjects().find((p) => p.id === id)
}
