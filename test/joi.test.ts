import Joi from 'joi'
import { describe, expect, it } from 'vitest'
import { getJoiErrors, isJoiSchema } from '../src/joi'

describe('isJoiSchema', () => {
  it('should return true for a valid Joi schema', () => {
    const schema = Joi.object({ name: Joi.string().required() })
    expect(isJoiSchema(schema)).toBe(true)
  })

  it('should return false for non-objects', () => {
    expect(isJoiSchema(null)).toBe(false)
    expect(isJoiSchema(123)).toBe(false)
    expect(isJoiSchema('string')).toBe(false)
  })

  it('should return false for objects without validateAsync and id', () => {
    const invalidSchema = { someProp: 'value' }
    expect(isJoiSchema(invalidSchema)).toBe(false)
  })
})

describe('getJoiErrors', () => {
  it('should return empty errors for valid data', async () => {
    const schema = Joi.object({ name: Joi.string().required() })
    const form = { name: 'Valid Name' }
    const errors = await getJoiErrors(schema, form)
    expect(errors).toEqual({})
  })

  it('should return errors for invalid data', async () => {
    const schema = Joi.object({ name: Joi.string().required() })
    const form = { name: '' }
    const errors = await getJoiErrors(schema, form)
    expect(errors).toEqual({ name: '"name" is not allowed to be empty' })
  })

  it('should handle multiple errors', async () => {
    const schema = Joi.object({
      name: Joi.string().required(),
      age: Joi.number().min(18),
    })
    const form = { name: '', age: 16 }
    const errors = await getJoiErrors(schema, form)
    expect(errors).toEqual({
      name: '"name" is not allowed to be empty',
      age: '"age" must be greater than or equal to 18',
    })
  })

  it('should handle nested errors', async () => {
    const schema = Joi.object({
      user: Joi.object({
        name: Joi.string().required(),
      }),
    })
    const form = { user: { name: '' } }
    const errors = await getJoiErrors(schema, form)
    expect(errors).toEqual({ user: '"user.name" is not allowed to be empty' })
  })
})
