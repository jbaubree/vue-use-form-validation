import type { ZodSchema } from 'zod'
import type { FieldErrors, Form } from '../types'
import { isNonNullObject } from '../utils'

export const Zod = {
  check: (schema: unknown): schema is ZodSchema => isNonNullObject(schema) && !!schema.safeParseAsync,
  async getErrors<F extends Form>(schema: ZodSchema, form: F): Promise<FieldErrors<F>> {
    const errors: FieldErrors<F> = {}
    const result = await schema.safeParseAsync(form)
    result.error?.issues.forEach(i => errors[i.path[0] as keyof F] = i.message)
    return errors
  },
}
