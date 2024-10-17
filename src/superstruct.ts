import type { Struct } from 'superstruct'
import type { FieldErrors, Form } from './types'
import { isNonNullObject } from './utils'

export function isSuperStructSchema<S, F extends Form>(schema: unknown): schema is Struct<F, S> {
  return (
    isNonNullObject(schema)
    && 'schema' in schema
    && typeof schema.coercer === 'function'
    && typeof schema.validator === 'function'
    && typeof schema.refiner === 'function'
  )
}

export function getSuperStructErrors<S, F extends Form>(schema: Struct<F, S>, form: F): FieldErrors<F> {
  const errors: FieldErrors<F> = {}
  const [structError] = schema.validate(form)
  if (structError) {
    const errs = structError.failures()
    errs.forEach((i) => {
      errors[i.path[0] as keyof F] = i.message
    })
  }
  return errors
}
