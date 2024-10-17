import type { ZodSchema } from 'zod'
import type { FieldErrors } from './types'
import { isNonNullObject } from './utils'

export function isZodSchema(schema: unknown): schema is ZodSchema {
  return isNonNullObject(schema) && schema.parse !== undefined
}

export async function getZodErrors<F>(schema: ZodSchema, form: F): Promise<FieldErrors<F>> {
  const errors: FieldErrors<F> = {}
  const result = await schema.safeParseAsync(form)
  if (result.success === false) {
    result.error.issues.forEach(i => errors[i.path[0] as keyof F] = i.message)
  }
  return errors
}
