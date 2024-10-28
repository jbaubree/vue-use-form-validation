import type { Schema as JoiSchema } from 'joi'
import type { Struct } from 'superstruct'
import type { BaseIssue, BaseSchema as ValibotSchema } from 'valibot'
import type { ComputedRef, Ref } from 'vue'
import type { ObjectSchema as YupSchema } from 'yup'
import type { ZodSchema } from 'zod'

export type Awaitable<T> = T | PromiseLike<T>

export type FieldErrors<F> = Partial<Record<keyof F, string>>
export type Form = Record<string, unknown>
export type GetErrorsFn<S, F extends Form> = (schema: S, form: F) => Awaitable<FieldErrors<F>>

export type Schema<F extends Form> =
  | ZodSchema
  | YupSchema<F>
  | ValibotSchema<unknown, unknown, BaseIssue<unknown>>
  | JoiSchema
  | Struct<F>

export interface ReturnType<F> {
  validate: () => Promise<FieldErrors<F>>
  errors: Ref<FieldErrors<F>>
  errorCount: ComputedRef<number>
  isLoading: Ref<boolean>
  isValid: ComputedRef<boolean>
  hasError: ComputedRef<boolean>
  clearErrors: () => void
  getErrorMessage: (path: keyof F) => string | undefined
  focusFirstErroredInput: () => void
  focusInput: (options: { inputName: keyof F }) => void
}
