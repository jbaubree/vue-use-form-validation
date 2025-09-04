import { object, string } from 'valibot'
import { describe, expect, it } from 'vitest'
import { Valibot } from '../../src/validators/valibot'

describe('check', () => {
  it('should return true for a valid Valibot schema', () => {
    const schema = object({ name: string() })
    expect(Valibot.check(schema)).toBe(true)
  })

  it('should return false for non-objects', () => {
    expect(Valibot.check(null)).toBe(false)
    expect(Valibot.check(123)).toBe(false)
    expect(Valibot.check('string')).toBe(false)
  })

  it('should return false for objects without _parse, _run, or schema properties', () => {
    const invalidSchema = { someProp: 'value' }
    expect(Valibot.check(invalidSchema)).toBe(false)
  })
})

describe('getErrors', () => {
  it('should return empty errors for valid data', () => {
    const schema = object({ name: string() })
    const form = { name: 'Valid Name' }
    const errors = Valibot.getErrors(schema, form, 'flatten')
    expect(errors).toEqual({})
  })

  it('should return errors for invalid data', () => {
    const schema = object({ name: string() })
    const form = { name: 123 }
    const errors = Valibot.getErrors(schema, form, 'flatten')
    expect(errors).toEqual({ name: 'Invalid type: Expected string but received 123' })
  })

  it('should handle multiple errors', () => {
    const schema = object({
      name: string(),
      age: string(),
    })
    const form = { name: 123, age: 456 }
    const errors = Valibot.getErrors(schema, form, 'flatten')
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
    const errors = Valibot.getErrors(schema, form, 'flatten')
    expect(errors).toEqual({ user: 'Invalid type: Expected string but received 123' })
  })

  it('should handle errors with a single field and deep strategy', () => {
    const schema = object({
      userName: string(),
    })
    const form = { userName: 123 }
    const errors = Valibot.getErrors(schema, form, 'deep')
    expect(errors).toEqual({ userName: 'Invalid type: Expected string but received 123' })
  })

  it('should handle nested errors with deep strategy', () => {
    const schema = object({
      user: object({
        address: object({
          city: string(),
          state: string(),
        }),
      }),
    })
    const form = { user: { address: { city: 123, state: 123 } } }
    const errors = Valibot.getErrors(schema, form, 'deep')
    expect(errors).toEqual({ user: { address: { city: 'Invalid type: Expected string but received 123', state: 'Invalid type: Expected string but received 123' } } })
  })
})
