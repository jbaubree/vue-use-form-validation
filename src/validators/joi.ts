import type { ValidationError as JoiError, Schema as JoiSchema } from 'joi'
import type { FieldErrors, Form } from '../types'
import { isNonNullObject } from '../utils'

export const Joi = {
  check: (schema: unknown): schema is JoiSchema => isNonNullObject(schema) && 'validateAsync' in schema,
  errorCheck: (error: unknown): error is JoiError => isNonNullObject(error) && error.isJoi === true,
  async getErrors<F extends Form>(schema: JoiSchema, form: F): Promise<FieldErrors<F>> {
    const errors: FieldErrors<F> = {}
    try {
      await schema.validateAsync(form, { abortEarly: false })
    }
    catch (error) {
      if (Joi.errorCheck(error)) {
        error.details.forEach(i => errors[i.path[0] as keyof F] = i.message)
      }
    }
    return errors
  },
}
