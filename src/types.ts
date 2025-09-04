import type { Schema } from 'joi'
import type { ComputedRef, Ref } from 'vue'

type AnyObject = Record<string, any>

interface ZodShape<F> extends AnyObject { shape: Record<keyof F, unknown> }

type ZodSchema<F> = AnyObject & (ZodShape<F> | { _def: { schema: ZodShape<F> } })
interface YupSchema<F> extends AnyObject {
  fields: Record<keyof F, unknown>
}
interface ValibotSchema<F> extends AnyObject {
  entries: Record<keyof F, unknown>
}
interface SuperstructSchema<F> extends AnyObject {
  schema: Record<keyof F, unknown>
}

export type Validator = 'Joi' | 'SuperStruct' | 'Valibot' | 'Yup' | 'Zod'
export type ValidationMode = 'eager' | 'lazy' | 'agressive' | 'onBlur'
export type Awaitable<T> = T | PromiseLike<T>
export type FieldErrors<F> = Partial<Record<keyof F, string>>
export type ErrorStrategy = 'flatten' | 'deep'
export type Form = Record<string, unknown>
export type GetErrorsFn<S, F extends Form> = (schema: S, form: F, errorStrategy: ErrorStrategy) => Awaitable<FieldErrors<F>>

export type InputSchema<F extends Form> =
  | ZodSchema<F>
  | YupSchema<F>
  | ValibotSchema<F>
  | Schema<F>
  | SuperstructSchema<F>

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
