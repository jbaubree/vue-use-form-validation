import type { ValidationError as JoiError, Schema as JoiSchema } from 'joi'

import type { FieldErrors, Form } from './types'
import { isNonNullObject } from './utils'

export function isJoiSchema(schema: unknown): schema is JoiSchema {
  return isNonNullObject(schema)
    && 'validateAsync' in schema
    && 'id' in schema
}

function isJoiError(error: unknown): error is JoiError {
  return isNonNullObject(error)
    && 'isJoi' in error
    && error.isJoi === true
}

export async function getJoiErrors<T extends Form>(schema: JoiSchema, form: T): Promise<FieldErrors<T>> {
  const errors: FieldErrors<T> = {}
  try {
    await schema.validateAsync(form, { abortEarly: false })
    return {}
  }
  catch (error) {
    if (isJoiError(error)) {
      error.details.forEach(i => errors[i.path[0] as keyof T] = i.message)
    }
    return errors
  }
}
