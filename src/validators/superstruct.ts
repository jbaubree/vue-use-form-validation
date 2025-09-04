import type { Struct } from 'superstruct'
import type { ErrorStrategy, FieldErrors, Form } from '../types'
import { isNonNullObject, setNestedError } from '../utils'

export const SuperStruct = {
  check: (schema: unknown) => isNonNullObject(schema) && 'validator' in schema,
  getErrors<S, F extends Form>(schema: Struct<F, S>, form: F, errorStrategy: ErrorStrategy): FieldErrors<F> {
    const errors: FieldErrors<F> = {}
    const [structError] = schema.validate(form)
    structError?.failures().forEach((i) => {
      if (errorStrategy === 'flatten') {
        errors[i.path[0] as keyof F] = i.message as FieldErrors<F>[keyof F]
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
