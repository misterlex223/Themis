import { z } from 'zod'

const EnvSchema = z.object({
  PORT: z.coerce.number().int().positive().default(8080),
  HOST: z.string().default('127.0.0.1'),
  PROJECTS_JSON: z.string().optional(),
  IGNORE_DIRS: z.string().optional(),
})

export type Env = z.infer<typeof EnvSchema>

export function getEnv(): Env {
  return EnvSchema.parse(process.env)
}
