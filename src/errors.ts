import { getJoiErrors, isJoiSchema } from './joi'
import { getValibotErrors, isValibotSchema } from './valibot'
import { getYupErrors, isYupSchema } from './yup'
import { getZodErrors, isZodSchema } from './zod'
import type { FieldErrors, Form, Schema } from './types'

export async function getErrors<T extends Schema<U>, U extends Form>(schema: T, form: U): Promise<FieldErrors<U>> {
  if (isZodSchema(schema)) {
    return await getZodErrors<U>(schema, form)
  }
  if (isYupSchema<U>(schema)) {
    return await getYupErrors<U>(schema, form)
  }
  if (isJoiSchema(schema)) {
    return await getJoiErrors<U>(schema, form)
  }
  if (isValibotSchema(schema)) {
    return getValibotErrors<U>(schema, form)
  }
  return {}
}
