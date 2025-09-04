import type { ValidationError as JoiError, Schema as JoiSchema } from 'joi'
import type { ErrorStrategy, FieldErrors, Form } from '../types'
import { isNonNullObject, setNestedError } from '../utils'

export const Joi = {
  check: (schema: unknown): schema is JoiSchema => isNonNullObject(schema) && 'validateAsync' in schema,
  errorCheck: (error: unknown): error is JoiError => isNonNullObject(error) && error.isJoi === true,
  async getErrors<F extends Form>(schema: JoiSchema, form: F, errorStrategy: ErrorStrategy): Promise<FieldErrors<F>> {
    const errors: FieldErrors<F> = {}
    try {
      await schema.validateAsync(form, { abortEarly: false })
    }
    catch (error) {
      if (Joi.errorCheck(error)) {
        error.details.forEach((i) => {
          if (errorStrategy === 'flatten') {
            errors[i.path[0] as keyof F] = i.message
          }
          else {
            const path = i.path.join('.')
            if (path) {
              const fieldName = i.path[i.path.length - 1]
              const cleanedMessage = i.message.replace(path, fieldName.toString())
              setNestedError(path, cleanedMessage, errors)
            }
          }
        })
      }
    }
    return errors
  },
}
