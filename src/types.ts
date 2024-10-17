import type { Schema as JoiSchema } from 'joi'
import type { BaseIssue, BaseSchema as ValibotSchema } from 'valibot'
import type { ComputedRef, Ref } from 'vue'
import type { ObjectSchema as YupSchema } from 'yup'
import type { ZodSchema } from 'zod'

export type Awaitable<T> = T | PromiseLike<T>

export type FieldErrors<T> = Partial<Record<keyof T, string>>
export type Form = Record<string, unknown>
export type GetErrorsFn<T, U extends Form> = (schema: T, form: U) => Awaitable<FieldErrors<U>>

export type Schema<T extends object> =
  | ZodSchema
  | YupSchema<T>
  | ValibotSchema<unknown, unknown, BaseIssue<unknown>>
  | JoiSchema

export interface ReturnType<T> {
  validate: () => Promise<FieldErrors<T>>
  errors: Ref<FieldErrors<T>>
  errorCount: ComputedRef<number>
  isValid: Ref<boolean>
  hasError: ComputedRef<boolean>
  clearErrors: () => void
  getErrorMessage: (path: keyof T) => string | undefined
  focusFirstErroredInput: () => void
  focusInput: (options: { inputName: keyof T }) => void
}
