import type { BaseIssue, BaseSchema } from 'valibot'
import type { ErrorStrategy, FieldErrors, Form } from '../types'
import { isNonNullObject, setNestedError } from '../utils'

type ValibotSchema = BaseSchema<unknown, unknown, BaseIssue<unknown>>

export const Valibot = {
  check: (schema: unknown) => isNonNullObject(schema) && '_run' in schema,
  getErrors<F extends Form>(schema: ValibotSchema, form: F, errorStrategy: ErrorStrategy): FieldErrors<F> {
    const errors: FieldErrors<F> = {}
    const result = schema._run({ typed: false, value: form }, {})
    result.issues?.forEach((i) => {
      if (errorStrategy === 'flatten') {
        errors[i.path?.[0].key as keyof F] = i.message as FieldErrors<F>[keyof F]
      }
      else {
        const path = i.path?.map(p => p.key).join('.')
        if (path) {
          setNestedError(path, i.message, errors)
        }
      }
    })
    return errors
  },
}
