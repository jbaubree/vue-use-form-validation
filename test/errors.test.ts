import { object as joiObject, string as joiString } from 'joi'
import * as v from 'valibot'
import { describe, expect, it, vi } from 'vitest'
import * as yup from 'yup'
import * as z from 'zod'
import { getErrors } from '../src/errors'
import * as joiModule from '../src/joi'
import * as valibotModule from '../src/valibot'
import * as yupModule from '../src/yup'
import * as zodModule from '../src/zod'

vi.mock('../src/zod', async (importOriginal) => {
  const actual = await importOriginal<object>()
  return {
    ...actual,
    getZodErrors: vi.fn().mockResolvedValue({ field: 'Zod: required' }),
  }
})
vi.mock('../src/yup', async (importOriginal) => {
  const actual = await importOriginal<object>()
  return {
    ...actual,
    getYupErrors: vi.fn().mockResolvedValue({ field: 'Yup: required' }),
  }
})
vi.mock('../src/joi', async (importOriginal) => {
  const actual = await importOriginal<object>()
  return {
    ...actual,
    getJoiErrors: vi.fn().mockResolvedValue({ field: 'Joi: required' }),
  }
})
vi.mock('../src/valibot', async (importOriginal) => {
  const actual = await importOriginal<object>()
  return {
    ...actual,
    getValibotErrors: vi.fn().mockResolvedValue({ field: 'Valibot: required' }),
  }
})

describe('getErrors', () => {
  it('should call getZodErrors for Zod schemas', async () => {
    const schema = z.object({ field: z.string() })
    const form = { field: undefined }
    const errors = await getErrors(schema, form)
    expect(errors).toEqual({ field: 'Zod: required' })
    expect(zodModule.getZodErrors).toHaveBeenCalledWith(schema, form)
  })

  it('should call getYupErrors for Yup schemas', async () => {
    const schema = yup.object({ field: yup.string() })
    const form: yup.InferType<typeof schema> = { field: undefined }
    const errors = await getErrors(schema, form)
    expect(errors).toEqual({ field: 'Yup: required' })
    expect(yupModule.getYupErrors).toHaveBeenCalledWith(schema, form)
  })

  it('should call getJoiErrors for Joi schemas', async () => {
    const schema = joiObject({ field: joiString().required() })
    const form = { field: undefined }
    const errors = await getErrors(schema, form)
    expect(errors).toEqual({ field: 'Joi: required' })
    expect((joiModule.getJoiErrors)).toHaveBeenCalledWith(schema, form)
  })

  it('should call getValibotErrors for Valibot schemas', async () => {
    const schema = v.object({ field: v.string() })
    const form = { field: undefined }
    const errors = await getErrors(schema, form)
    expect(errors).toEqual({ field: 'Valibot: required' })
    expect(valibotModule.getValibotErrors).toHaveBeenCalledWith(schema, form)
  })

  it('should return an empty object for unknown schemas', async () => {
    const invalidSchema = { someProp: 'value' }
    const form = { field: 'value' }
    // @ts-expect-error schema is invalid on purpose
    const errors = await getErrors(invalidSchema, form)
    expect(errors).toEqual({})
  })
})
