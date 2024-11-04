import { describe, expect, it } from 'vitest'
import * as yup from 'yup'
import { Yup } from '../../src/validators/yup'

describe('check', () => {
  it('should return true for a valid Yup schema', () => {
    const schema = yup.object({ name: yup.string() })
    expect(Yup.check(schema)).toBe(true)
  })

  it('should return false for non-objects', () => {
    expect(Yup.check(null)).toBe(false)
    expect(Yup.check(123)).toBe(false)
    expect(Yup.check('string')).toBe(false)
  })

  it('should return false for objects without validate and __isYupSchema__', () => {
    const invalidSchema = { someProp: 'value' }
    expect(Yup.check(invalidSchema)).toBe(false)
  })
})

describe('getErrors', () => {
  it('should return empty errors for valid data', async () => {
    const schema = yup.object({ name: yup.string().required() })
    const form = { name: 'Valid Name' }
    const errors = await Yup.getErrors(schema, form)
    expect(errors).toEqual({})
  })

  it('should return errors for invalid data', async () => {
    const schema = yup.object({ name: yup.string().required() })
    const form = { name: '' }
    const errors = await Yup.getErrors(schema, form)
    expect(errors).toEqual({ name: 'name is a required field' })
  })

  it('should handle multiple errors', async () => {
    const schema = yup.object({
      name: yup.string().required(),
      age: yup.number().min(18, 'Must be 18 or older'),
    })
    const form = { name: '', age: 16 }
    const errors = await Yup.getErrors(schema, form)
    expect(errors).toEqual({
      name: 'name is a required field',
      age: 'Must be 18 or older',
    })
  })

  it('should handle nested errors', async () => {
    const schema = yup.object({
      user: yup.object({
        name: yup.string().required(),
      }),
    })
    const form = { user: { name: '' } }
    const errors = await Yup.getErrors(schema, form)
    expect(errors).toEqual({ user: 'user.name is a required field' })
  })
})
