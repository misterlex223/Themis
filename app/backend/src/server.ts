import Fastify from 'fastify'
import cors from '@fastify/cors'
import { z } from 'zod'
import { getEnv } from './lib/env'
import { logger } from './lib/logger'
import { listProjects, getProjectById } from './services/projects'
import { refreshIndex, getIndexTree, getIndexStatus } from './services/indexer'
import { readMarkdownFile, writeMarkdownFile } from './services/files'

const app = Fastify({ logger })

async function registerPlugins() {
  await app.register(cors, {
    origin: (origin, cb) => cb(null, true),
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  })
}

function routes() {
  // Health
  app.get('/health', async () => ({ status: 'ok', time: new Date().toISOString() }))

  // Projects
  app.get('/api/projects', async () => ({ success: true, data: listProjects() }))

  // Indexing
  app.post('/api/projects/:id/refresh', async (req, reply) => {
    const id = (req.params as any).id as string
    const project = getProjectById(id)
    if (!project) return reply.code(404).send({ success: false, error: 'not_found' })
    const status = await refreshIndex(project)
    return { success: true, data: status }
  })

  app.get('/api/projects/:id/index', async (req, reply) => {
    const id = (req.params as any).id as string
    const project = getProjectById(id)
    if (!project) return reply.code(404).send({ success: false, error: 'not_found' })
    const tree = getIndexTree(project.id)
    if (!tree) return reply.code(404).send({ success: false, error: 'not_found' })
    return { success: true, data: tree }
  })

  app.get('/api/projects/:id/status', async (req, reply) => {
    const id = (req.params as any).id as string
    const project = getProjectById(id)
    if (!project) return reply.code(404).send({ success: false, error: 'not_found' })
    const status = getIndexStatus(project.id)
    if (!status) return reply.code(404).send({ success: false, error: 'not_found' })
    return { success: true, data: status }
  })

  // Files
  app.get('/api/projects/:id/file', async (req, reply) => {
    const id = (req.params as any).id as string
    const { path } = z.object({ path: z.string().min(1) }).parse((req.query as any) ?? {})
    const project = getProjectById(id)
    if (!project) return reply.code(404).send({ success: false, error: 'not_found' })
    try {
      const data = await readMarkdownFile(project, path)
      return { success: true, data }
    } catch (err: any) {
      if (err.code === 'forbidden') return reply.code(403).send({ success: false, error: 'forbidden', message: err.message })
      if (err.code === 'not_found') return reply.code(404).send({ success: false, error: 'not_found', message: err.message })
      if (err.code === 'invalid_argument') return reply.code(400).send({ success: false, error: 'invalid_argument', message: err.message })
      app.log.error({ err }, 'read file failed')
      return reply.code(500).send({ success: false, error: 'internal_error' })
    }
  })

  app.put('/api/projects/:id/file', async (req, reply) => {
    const id = (req.params as any).id as string
    const body = z
      .object({ path: z.string().min(1), content: z.string(), baseMtime: z.number().int().nonnegative().optional() })
      .parse((req.body as any) ?? {})
    const project = getProjectById(id)
    if (!project) return reply.code(404).send({ success: false, error: 'not_found' })
    try {
      const result = await writeMarkdownFile(project, body)
      return { success: true, data: result }
    } catch (err: any) {
      if (err.code === 'forbidden') return reply.code(403).send({ success: false, error: 'forbidden', message: err.message })
      if (err.code === 'not_found') return reply.code(404).send({ success: false, error: 'not_found', message: err.message })
      if (err.code === 'invalid_argument') return reply.code(400).send({ success: false, error: 'invalid_argument', message: err.message })
      if (err.code === 'conflict') return reply.code(409).send({ success: false, error: 'conflict', message: err.message })
      app.log.error({ err }, 'write file failed')
      return reply.code(500).send({ success: false, error: 'internal_error' })
    }
  })
}

export async function start() {
  const { HOST, PORT } = getEnv()
  await registerPlugins()
  routes()
  await app.listen({ host: HOST, port: PORT })
  app.log.info({ HOST, PORT }, 'server started')
}

if (import.meta.url === `file://${process.argv[1]}`) {
  start().catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err)
    process.exit(1)
  })
}
