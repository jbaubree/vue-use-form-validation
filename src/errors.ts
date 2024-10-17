import type { FieldErrors, Form, GetErrorsFn, Schema } from './types'
import { getJoiErrors, isJoiSchema } from './joi'
import { getValibotErrors, isValibotSchema } from './valibot'
import { getYupErrors, isYupSchema } from './yup'
import { getZodErrors, isZodSchema } from './zod'

export async function getErrors<T extends Schema<U>, U extends Form>(
  schema: T,
  form: U,
): Promise<FieldErrors<U>>
export async function getErrors<T, U extends Form>(
  schema: T,
  form: U,
  transformFn: GetErrorsFn<T, U>,
): Promise<FieldErrors<U>>
export async function getErrors<T, U extends Form>(
  schema: T,
  form: U,
  transformFn?: GetErrorsFn<T, U>,
): Promise<FieldErrors<U>> {
  if (transformFn) {
    return await transformFn(schema, form)
  }
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
