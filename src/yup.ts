import type { ObjectSchema, ValidationError as YupError } from 'yup'
import { isNonNullObject } from './utils'
import type { FieldErrors, Form } from './types'

export function isYupSchema<T extends object>(schema: unknown): schema is ObjectSchema<T> {
  return isNonNullObject(schema)
    && 'validate' in schema
    && '__isYupSchema__' in schema
}

function isYupError(error: unknown): error is YupError {
  return isNonNullObject(error) && error.inner !== undefined
}

export async function getYupErrors<T extends Form>(schema: ObjectSchema<T>, form: T): Promise<FieldErrors<T>> {
  const errors: FieldErrors<T> = {}
  try {
    await schema.validate(form, { abortEarly: false })
    return {}
  }
  catch (error) {
    if (isYupError(error)) {
      error.inner.forEach(((i) => {
        if (i.path) {
          errors[i.path.split('.')[0] as keyof T] = i.message
        }
      }))
    }
    return errors
  }
}
