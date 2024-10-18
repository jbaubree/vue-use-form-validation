import type { FieldErrors, Form } from './types'
import { Ajv, type JSONSchemaType } from 'ajv'
import { isNonNullObject } from './utils'

export function isAjvSchema<F extends Form>(schema: unknown): schema is JSONSchemaType<F> {
  return isNonNullObject(schema)
    && 'properties' in schema
    && schema.type === 'object'
}

export function getAjvErrors<F extends Form>(schema: JSONSchemaType<F>, form: F): FieldErrors<F> {
  const errors: FieldErrors<F> = {}
  const ajv = new Ajv()
  const validate = ajv.compile(schema)
  if (validate(form))
    return errors
  validate.errors?.forEach((i) => {
    errors[i.instancePath.split('/').filter(Boolean)[0] as keyof F] = i.message
  })
  return errors
}
