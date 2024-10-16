import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { getZodErrors, isZodSchema } from '../src/zod'

describe('isZodSchema', () => {
  it('should return true for a valid Zod schema', () => {
    const schema = z.object({ name: z.string() })
    expect(isZodSchema(schema)).toBe(true)
  })

  it('should return false for non-objects', () => {
    expect(isZodSchema(null)).toBe(false)
    expect(isZodSchema(123)).toBe(false)
    expect(isZodSchema('string')).toBe(false)
  })

  it('should return false for objects without a parse method', () => {
    const invalidSchema = { someProp: 'value' }
    expect(isZodSchema(invalidSchema)).toBe(false)
  })
})

describe('getZodErrors', () => {
  it('should return empty errors for valid data', async () => {
    const schema = z.object({ name: z.string() })
    const form = { name: 'Valid Name' }
    const errors = await getZodErrors(schema, form)
    expect(errors).toEqual({})
  })

  it('should return errors for invalid data', async () => {
    const schema = z.object({ name: z.string() })
    const form = { name: 123 }
    const errors = await getZodErrors(schema, form)
    expect(errors).toEqual({ name: 'Expected string, received number' })
  })

  it('should handle nested errors', async () => {
    const schema = z.object({
      user: z.object({
        name: z.string(),
      }),
    })
    const form = { user: { name: 123 } }
    const errors = await getZodErrors(schema, form)
    expect(errors).toEqual({ user: 'Expected string, received number' })
  })
})
