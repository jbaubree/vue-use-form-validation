import type { ObjectSchema, ValidationError as YupError } from 'yup'
import type { FieldErrors, Form } from './types'
import { isNonNullObject } from './utils'

export function isYupSchema<F extends object>(schema: unknown): schema is ObjectSchema<F> {
  return isNonNullObject(schema)
    && 'validate' in schema
    && '__isYupSchema__' in schema
}

function isYupError(error: unknown): error is YupError {
  return isNonNullObject(error) && error.inner !== undefined
}

export async function getYupErrors<F extends Form>(schema: ObjectSchema<F>, form: F): Promise<FieldErrors<F>> {
  const errors: FieldErrors<F> = {}
  try {
    await schema.validate(form, { abortEarly: false })
    return {}
  }
  catch (error) {
    if (isYupError(error)) {
      error.inner.forEach((i) => {
        if (i.path) {
          errors[i.path.split('.')[0] as keyof F] = i.message
        }
      })
    }
    return errors
  }
}
