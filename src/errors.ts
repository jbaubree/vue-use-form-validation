import type { FieldErrors, Form, GetErrorsFn, Schema } from './types'
import { getAjvErrors, isAjvSchema } from './ajv'
import { getJoiErrors, isJoiSchema } from './joi'
import { getSuperStructErrors, isSuperStructSchema } from './superstruct'
import { getValibotErrors, isValibotSchema } from './valibot'
import { getYupErrors, isYupSchema } from './yup'
import { getZodErrors, isZodSchema } from './zod'

export async function getErrors<S extends Schema<F>, F extends Form>(
  schema: S,
  form: F,
): Promise<FieldErrors<F>>
export async function getErrors<S, F extends Form>(
  schema: S,
  form: F,
  transformFn: GetErrorsFn<S, F>,
): Promise<FieldErrors<F>>
export async function getErrors<S, F extends Form>(
  schema: S,
  form: F,
  transformFn?: GetErrorsFn<S, F>,
): Promise<FieldErrors<F>> {
  if (transformFn) {
    return await transformFn(schema, form)
  }
  if (isZodSchema(schema)) {
    return await getZodErrors<F>(schema, form)
  }
  if (isYupSchema<F>(schema)) {
    return await getYupErrors<F>(schema, form)
  }
  if (isJoiSchema(schema)) {
    return await getJoiErrors<F>(schema, form)
  }
  if (isValibotSchema(schema)) {
    return getValibotErrors<F>(schema, form)
  }
  if (isSuperStructSchema<S, F>(schema)) {
    return getSuperStructErrors<S, F>(schema, form)
  }
  if (isAjvSchema<F>(schema)) {
    return getAjvErrors<F>(schema, form)
  }
  return {}
}
