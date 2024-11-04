import type { Infer } from 'superstruct'
import { number, object, string } from 'superstruct'
import { describe, expect, it } from 'vitest'
import { SuperStruct } from '../../src/validators/superstruct'

describe('check', () => {
  it('should return true for a valid Superstruct schema', () => {
    const schema = object({
      name: string(),
    })
    expect(SuperStruct.check(schema)).toBe(true)
  })

  it('should return false for non-objects', () => {
    expect(SuperStruct.check(null)).toBe(false)
    expect(SuperStruct.check(123)).toBe(false)
    expect(SuperStruct.check('string')).toBe(false)
  })

  it('should return false for objects without expected properties', () => {
    const invalidSchema = { someProp: 'value' }
    expect(SuperStruct.check(invalidSchema)).toBe(false)
  })
})

describe('getErrors', () => {
  it('should return empty errors for valid data', () => {
    const schema = object({
      name: string(),
    })
    const form = { name: 'Valid Name' }
    const errors = SuperStruct.getErrors(schema, form)
    expect(errors).toEqual({})
  })

  it('should return errors for invalid data', () => {
    const schema = object({
      name: string(),
    })
    // @ts-expect-error form is invalid on purpose
    const form: Infer<typeof schema> = { name: undefined }
    const errors = SuperStruct.getErrors(schema, form)
    expect(errors).toEqual({ name: 'Expected a string, but received: undefined' })
  })

  it('should handle multiple errors', () => {
    const schema = object({
      name: string(),
      age: number(),
    })
    const form = { name: 123, age: 'not a number' }
    // @ts-expect-error form is invalid on purpose
    const errors = SuperStruct.getErrors(schema, form)
    expect(errors).toEqual({
      name: 'Expected a string, but received: 123',
      age: 'Expected a number, but received: \"not a number\"',
    })
  })

  it('should handle nested errors', () => {
    const schema = object({
      user: object({
        name: string(),
      }),
    })
    const form = { user: { name: 123 } }
    // @ts-expect-error form is invalid on purpose
    const errors = SuperStruct.getErrors(schema, form)
    expect(errors).toEqual({ user: 'Expected a string, but received: 123' })
  })
})
