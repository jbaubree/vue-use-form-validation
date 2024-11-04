import type { BaseIssue, BaseSchema } from 'valibot'
import type { FieldErrors, Form } from '../types'
import { isNonNullObject } from '../utils'

type ValibotSchema = BaseSchema<unknown, unknown, BaseIssue<unknown>>

export const Valibot = {
  check: (schema: unknown) => isNonNullObject(schema) && '_run' in schema,
  getErrors<F extends Form>(schema: ValibotSchema, form: F): FieldErrors<F> {
    const errors: FieldErrors<F> = {}
    const result = schema._run({ typed: false, value: form }, {})
    result.issues?.forEach(i => errors[i.path?.[0].key as keyof F] = i.message)
    return errors
  },
}
