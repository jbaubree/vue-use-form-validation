import type { z } from 'zod'

export type FieldErrors<U> = Partial<Record<keyof U, z.ZodIssue[]>> | null
