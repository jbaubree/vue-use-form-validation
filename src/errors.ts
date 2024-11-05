import type { MaybeRefOrGetter } from 'vue'
import type { FieldErrors, Form, GetErrorsFn, InputSchema } from './types'
import { toValue } from 'vue'
import { validators } from './validators'

export async function getErrors<S extends InputSchema<F>, F extends Form>(
  schema: S,
  form: MaybeRefOrGetter<F>,
  transformFn: GetErrorsFn<S, F> | null,
): Promise<FieldErrors<F>> {
  const formValue = toValue(form)
  const schemaValue = toValue(schema)
  if (transformFn)
    return await transformFn(schemaValue, formValue)
  for (const validator of Object.values(validators)) {
    if (validator.check(schemaValue)) {
      return await validator.getErrors(schemaValue, formValue)
    }
  }
  return {}
}
