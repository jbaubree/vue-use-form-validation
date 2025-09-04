import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { Zod } from '../../src/validators/zod'

describe('check', () => {
  it('should return true for a valid Zod schema', () => {
    const schema = z.object({ name: z.string() })
    expect(Zod.check(schema)).toBe(true)
  })

  it('should return false for non-objects', () => {
    expect(Zod.check(null)).toBe(false)
    expect(Zod.check(123)).toBe(false)
    expect(Zod.check('string')).toBe(false)
  })

  it('should return false for objects without a parse method', () => {
    const invalidSchema = { someProp: 'value' }
    expect(Zod.check(invalidSchema)).toBe(false)
  })
})

describe('getErrors', () => {
  it('should return empty errors for valid data', async () => {
    const schema = z.object({ name: z.string() })
    const form = { name: 'Valid Name' }
    const errors = await Zod.getErrors(schema, form, 'flatten')
    expect(errors).toEqual({})
  })

  it('should return errors for invalid data', async () => {
    const schema = z.object({ name: z.string() })
    const form = { name: 123 }
    const errors = await Zod.getErrors(schema, form, 'flatten')
    expect(errors).toEqual({ name: 'Expected string, received number' })
  })

  it('should handle nested errors', async () => {
    const schema = z.object({
      user: z.object({
        name: z.string(),
      }),
    })
    const form = { user: { name: 123 } }
    const errors = await Zod.getErrors(schema, form, 'flatten')
    expect(errors).toEqual({ user: 'Expected string, received number' })
  })

  it('should handle errors with a single field and deep strategy', async () => {
    const schema = z.object({
      userName: z.string(),
    })
    const form = { userName: 123 }
    const errors = await Zod.getErrors(schema, form, 'deep')
    expect(errors).toEqual({ userName: 'Expected string, received number' })
  })

  it('should handle nested errors with deep strategy', async () => {
    const schema = z.object({
      user: z.object({
        address: z.object({
          city: z.string(),
          state: z.string(),
        }),
      }),
    })
    const form = { user: { address: { city: 123, state: 123 } } }
    const errors = await Zod.getErrors(schema, form, 'deep')
    expect(errors).toEqual({ user: { address: { city: 'Expected string, received number', state: 'Expected string, received number' } } })
  })
})
