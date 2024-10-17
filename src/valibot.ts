import type { BaseIssue, BaseSchema } from 'valibot'
import type { FieldErrors, Form } from './types'
import { isNonNullObject } from './utils'

type ValibotSchema = BaseSchema<unknown, unknown, BaseIssue<unknown>>

export function isValibotSchema(schema: unknown): schema is ValibotSchema {
  return (isNonNullObject(schema)
    && ('_parse' in schema || '_run' in schema))
    || (typeof schema === 'function' && 'schema' in schema)
}

export function getValibotErrors<F extends Form>(schema: ValibotSchema, form: F): FieldErrors<F> {
  const errors: FieldErrors<F> = {}
  const result = schema._run({ typed: false, value: form }, {})
  result.issues?.forEach((i) => {
    if (i.path) {
      errors[i.path[0].key as keyof F] = i.message
    }
  })
  return errors
}
