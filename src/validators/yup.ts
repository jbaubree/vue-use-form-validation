import type { ObjectSchema, ValidationError as YupError } from 'yup'
import type { FieldErrors, Form } from '../types'
import { isNonNullObject } from '../utils'

export const Yup = {
  check: (schema: unknown) => isNonNullObject(schema) && '__isYupSchema__' in schema,
  errorCheck: (error: unknown): error is YupError => isNonNullObject(error) && !!error.inner,
  async getErrors<F extends Form>(schema: ObjectSchema<F>, form: F): Promise<FieldErrors<F>> {
    const errors: FieldErrors<F> = {}
    try {
      await schema.validate(form, { abortEarly: false })
    }
    catch (error) {
      if (Yup.errorCheck(error)) {
        error.inner.forEach(i => errors[i.path?.split('.')[0] as keyof F] = i.message)
      }
    }
    return errors
  },
}
