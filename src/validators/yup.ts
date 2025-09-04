import type { ObjectSchema, ValidationError as YupError } from 'yup'
import type { ErrorStrategy, FieldErrors, Form } from '../types'
import { isNonNullObject, setNestedError } from '../utils'

export const Yup = {
  check: (schema: unknown) => isNonNullObject(schema) && '__isYupSchema__' in schema,
  errorCheck: (error: unknown): error is YupError => isNonNullObject(error) && !!error.inner,
  async getErrors<F extends Form>(schema: ObjectSchema<F>, form: F, errorStrategy: ErrorStrategy): Promise<FieldErrors<F>> {
    const errors: FieldErrors<F> = {}
    try {
      await schema.validate(form, { abortEarly: false })
    }
    catch (error) {
      if (Yup.errorCheck(error)) {
        if (errorStrategy === 'flatten') {
          error.inner.forEach(i => errors[i.path?.split('.')[0] as keyof F] = i.message)
        }
        else {
          error.inner.forEach((i) => {
            if (i.path) {
              const lastField = i.path.split('.').pop()
              const cleanMessage = i.message.replace(new RegExp(`^.*\\b${lastField}\\b`), lastField ?? '')
              setNestedError(i.path, cleanMessage, errors)
            }
          })
        }
      }
    }
    return errors
  },
}
