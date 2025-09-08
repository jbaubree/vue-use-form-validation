import Joi from 'joi'
import { describe, expect, it } from 'vitest'
import { Joi as JoiValidator } from '../../src/validators/joi'

describe('check', () => {
  it('should return true for a valid Joi schema', () => {
    const schema = Joi.object({ name: Joi.string().required() })
    expect(JoiValidator.check(schema)).toBe(true)
  })

  it('should return false for non-objects', () => {
    expect(JoiValidator.check(null)).toBe(false)
    expect(JoiValidator.check(123)).toBe(false)
    expect(JoiValidator.check('string')).toBe(false)
  })

  it('should return false for objects without validateAsync and id', () => {
    const invalidSchema = { someProp: 'value' }
    expect(JoiValidator.check(invalidSchema)).toBe(false)
  })
})

describe('getErrors', () => {
  it('should return empty errors for valid data', async () => {
    const schema = Joi.object({ name: Joi.string().required() })
    const form = { name: 'Valid Name' }
    const errors = await JoiValidator.getErrors(schema, form, 'flatten')
    expect(errors).toEqual({})
  })

  it('should return errors for invalid data', async () => {
    const schema = Joi.object({ name: Joi.string().required() })
    const form = { name: '' }
    const errors = await JoiValidator.getErrors(schema, form, 'flatten')
    expect(errors).toEqual({ name: '"name" is not allowed to be empty' })
  })

  it('should handle multiple errors', async () => {
    const schema = Joi.object({
      name: Joi.string().required(),
      age: Joi.number().min(18),
    })
    const form = { name: '', age: 16 }
    const errors = await JoiValidator.getErrors(schema, form, 'flatten')
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
    const errors = await JoiValidator.getErrors(schema, form, 'flatten')
    expect(errors).toEqual({ user: '"user.name" is not allowed to be empty' })
  })

  it('should handle errors with a single field and deep strategy', async () => {
    const schema = Joi.object({
      userName: Joi.string().required(),
    })
    const form = { userName: '' }
    const errors = await JoiValidator.getErrors(schema, form, 'deep')
    expect(errors).toEqual({ userName: '"userName" is not allowed to be empty' })
  })

  it('should handle nested errors with deep strategy', async () => {
    const schema = Joi.object({
      user: Joi.object({
        address: Joi.object({
          city: Joi.string().required(),
          state: Joi.string().required(),
        }),
      }),
    })
    const form = { user: { address: { city: '', state: '' } } }
    const errors = await JoiValidator.getErrors(schema, form, 'deep')
    expect(errors).toEqual({ user: { address: { city: '"city" is not allowed to be empty', state: '"state" is not allowed to be empty' } } })
  })
})
