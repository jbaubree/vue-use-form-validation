import type { BaseIssue, BaseSchema } from 'valibot'
import { isNonNullObject } from './utils'
import type { FieldErrors, Form } from './types'

type ValibotSchema = BaseSchema<unknown, unknown, BaseIssue<unknown>>

export function isValibotSchema(schema: unknown): schema is ValibotSchema {
  return (isNonNullObject(schema)
    && ('_parse' in schema || '_run' in schema))
    || (typeof schema === 'function' && 'schema' in schema)
}

export function getValibotErrors<T extends Form>(schema: ValibotSchema, form: T): FieldErrors<T> {
  const errors: FieldErrors<T> = {}
  const result = schema._run({ typed: false, value: form }, {})
  result.issues?.forEach(((i) => {
    if (i.path) {
      errors[i.path[0].key as keyof T] = i.message
    }
  }))
  return errors
}
