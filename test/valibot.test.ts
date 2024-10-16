import { object, string } from 'valibot'
import { describe, expect, it } from 'vitest'
import { getValibotErrors, isValibotSchema } from '../src/valibot'

describe('isValibotSchema', () => {
  it('should return true for a valid Valibot schema', () => {
    const schema = object({ name: string() })
    expect(isValibotSchema(schema)).toBe(true)
  })

  it('should return false for non-objects', () => {
    expect(isValibotSchema(null)).toBe(false)
    expect(isValibotSchema(123)).toBe(false)
    expect(isValibotSchema('string')).toBe(false)
  })

  it('should return false for objects without _parse, _run, or schema properties', () => {
    const invalidSchema = { someProp: 'value' }
    expect(isValibotSchema(invalidSchema)).toBe(false)
  })

  it('should return true for a function with a schema property', () => {
    const schemaFunction = Object.assign(() => {}, { schema: object({ name: string() }) })
    expect(isValibotSchema(schemaFunction)).toBe(true)
  })
})

describe('getValibotErrors', () => {
  it('should return empty errors for valid data', () => {
    const schema = object({ name: string() })
    const form = { name: 'Valid Name' }
    const errors = getValibotErrors(schema, form)
    expect(errors).toEqual({})
  })

  it('should return errors for invalid data', () => {
    const schema = object({ name: string() })
    const form = { name: 123 }
    const errors = getValibotErrors(schema, form)
    expect(errors).toEqual({ name: 'Invalid type: Expected string but received 123' })
  })

  it('should handle multiple errors', () => {
    const schema = object({
      name: string(),
      age: string(),
    })
    const form = { name: 123, age: 456 }
    const errors = getValibotErrors(schema, form)
    expect(errors).toEqual({
      name: 'Invalid type: Expected string but received 123',
      age: 'Invalid type: Expected string but received 456',
    })
  })

  it('should handle nested errors', () => {
    const schema = object({
      user: object({
        name: string(),
      }),
    })
    const form = { user: { name: 123 } }
    const errors = getValibotErrors(schema, form)
    expect(errors).toEqual({ user: 'Invalid type: Expected string but received 123' })
  })
})
