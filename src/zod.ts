import type { ZodSchema } from 'zod'
import type { FieldErrors } from './types'
import { isNonNullObject } from './utils'

export function isZodSchema(schema: unknown): schema is ZodSchema {
  return isNonNullObject(schema) && schema.parse !== undefined
}

export async function getZodErrors<T>(schema: ZodSchema, form: T): Promise<FieldErrors<T>> {
  const errors: FieldErrors<T> = {}
  const result = await schema.safeParseAsync(form)
  if (result.success === false) {
    result.error.issues.forEach(i => errors[i.path[0] as keyof T] = i.message)
  }
  return errors
}
