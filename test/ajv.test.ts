import type { JSONSchemaType } from 'ajv'
import { describe, expect, it } from 'vitest'
import { getAjvErrors, isAjvSchema } from '../src/ajv'

describe('isAjvSchema', () => {
  it('should return true for a valid Ajv schema', () => {
    const schema: JSONSchemaType<{ name: string }> = {
      type: 'object',
      properties: {
        name: { type: 'string' },
      },
      required: ['name'],
    }
    expect(isAjvSchema(schema)).toBe(true)
  })

  it('should return false for non-objects', () => {
    expect(isAjvSchema(null)).toBe(false)
    expect(isAjvSchema(123)).toBe(false)
    expect(isAjvSchema('string')).toBe(false)
  })

  it('should return false for objects without properties or type object', () => {
    const invalidSchema = { someProp: 'value' }
    expect(isAjvSchema(invalidSchema)).toBe(false)
  })
})

describe('getAjvErrors', () => {
  // it('should return empty errors for valid data', () => {
  //   const schema: JSONSchemaType<{ name: string }> = {
  //     type: 'object',
  //     properties: {
  //       name: { type: 'string' },
  //     },
  //     required: ['name'],
  //   }
  //   const form = { name: 'Valid Name' }
  //   const errors = getAjvErrors(schema, form)
  //   expect(errors).toEqual({})
  // })

  it('should return errors for invalid data', () => {
    const form = { name: 123 }
    // @ts-expect-error form is invalid on purpose
    const schema: JSONSchemaType<typeof form> = {
      type: 'object',
      properties: {
        name: { type: 'string' },
      },
      required: ['name'],
    }
    const errors = getAjvErrors(schema, form)
    expect(errors).toEqual({ name: 'must be string' })
  })

  it('should return an empty object when the form is valid', () => {
    const form = { name: 'Valid Name' }
    const schema: JSONSchemaType<typeof form> = {
      type: 'object',
      properties: {
        name: { type: 'string' },
      },
      required: ['name'],
    }
    const errors = getAjvErrors(schema, form)
    expect(errors).toEqual({})
  })

  it('should handle nested errors', () => {
    const form = { user: { name: 123 } }
    // @ts-expect-error form is invalid on purpose
    const schema: JSONSchemaType<typeof form> = {
      type: 'object',
      properties: {
        user: {
          type: 'object',
          properties: {
            name: { type: 'string' },
          },
          required: ['name'],
        },
      },
      required: ['user'],
    }
    const errors = getAjvErrors(schema, form)
    expect(errors).toEqual({ user: 'must be string' })
  })
})
