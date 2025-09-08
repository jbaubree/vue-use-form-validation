import type { Awaitable, ErrorStrategy, FieldErrors, Form, Validator } from '../types'
import { Joi } from './joi'
import { SuperStruct } from './superstruct'
import { Valibot } from './valibot'
import { Yup } from './yup'
import { Zod } from './zod'

export const validators: Record<Validator, {
  check: (schema: unknown) => boolean
  errorCheck?: (error: unknown) => boolean
  getErrors: <F extends Form>(schema: any, form: F, errorStrategy: ErrorStrategy) => Awaitable<FieldErrors<F>>
}> = {
  Joi,
  SuperStruct,
  Valibot,
  Yup,
  Zod,
}
