import type { FieldErrors, Form, GetErrorsFn, InputSchema } from './types'
import { validators } from './validators'

export async function getErrors<S extends InputSchema<F>, F extends Form>(
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
  if (transformFn)
    return await transformFn(schema, form)
  for (const validator of Object.values(validators)) {
    if (validator.check(schema)) {
      return await validator.getErrors(schema, form)
    }
  }
  return {}
}
