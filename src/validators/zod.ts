import type { ZodSchema } from 'zod'
import type { ErrorStrategy, FieldErrors, Form } from '../types'
import { isNonNullObject, setNestedError } from '../utils'

export const Zod = {
  check: (schema: unknown): schema is ZodSchema => isNonNullObject(schema) && !!schema.safeParseAsync,
  async getErrors<F extends Form>(schema: ZodSchema, form: F, errorStrategy: ErrorStrategy): Promise<FieldErrors<F>> {
    const errors: FieldErrors<F> = {}
    const result = await schema.safeParseAsync(form)
    result.error?.issues.forEach((i) => {
      if (errorStrategy === 'flatten') {
        errors[i.path[0] as keyof F] = i.message
      }
      else {
        const path = i.path.join('.')
        if (path) {
          setNestedError(path, i.message, errors)
        }
      }
    })
    return errors
  },
}
