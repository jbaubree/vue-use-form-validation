import type { Struct } from 'superstruct'
import type { FieldErrors, Form } from '../types'
import { isNonNullObject } from '../utils'

export const SuperStruct = {
  check: (schema: unknown) => isNonNullObject(schema) && 'validator' in schema,
  getErrors<S, F extends Form>(schema: Struct<F, S>, form: F): FieldErrors<F> {
    const errors: FieldErrors<F> = {}
    const [structError] = schema.validate(form)
    structError?.failures().forEach(i => errors[i.path[0] as keyof F] = i.message)
    return errors
  },
}
