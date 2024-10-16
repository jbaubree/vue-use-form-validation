import type { Schema as JoiSchema } from 'joi'
import type { BaseIssue, BaseSchema as ValibotSchema } from 'valibot'
import type { ObjectSchema as YupSchema } from 'yup'
import type { ZodSchema } from 'zod'

export type FieldErrors<T> = Partial<Record<keyof T, string>>

export type Schema<T extends object> =
  | ZodSchema
  | YupSchema<T>
  | ValibotSchema<unknown, unknown, BaseIssue<unknown>>
  | JoiSchema

export type Form = Record<string, unknown>
