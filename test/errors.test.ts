import { object as joiObject, string as joiString } from 'joi'
import * as s from 'superstruct'
import * as v from 'valibot'
import { describe, expect, it, vi } from 'vitest'
import * as yup from 'yup'
import * as z from 'zod'
import { getErrors } from '../src/errors'
import { validators } from '../src/validators/index'
import { Joi } from '../src/validators/joi'
import { SuperStruct } from '../src/validators/superstruct'
import { Valibot } from '../src/validators/valibot'
import { Yup } from '../src/validators/yup'
import { Zod } from '../src/validators/zod'

vi.mock('../src/validators/index', async () => ({ validators: {
  Zod: {
    check: (s: unknown) => Zod.check(s),
    getErrors: vi.fn().mockResolvedValue({ field: 'Zod: required' }),
  },
  Yup: {
    check: (s: unknown) => Yup.check(s),
    errorCheck: (e: unknown) => Yup.errorCheck(e),
    getErrors: vi.fn().mockResolvedValue({ field: 'Yup: required' }),
  },
  Joi: {
    check: (s: unknown) => Joi.check(s),
    errorCheck: (e: unknown) => Joi.errorCheck(e),
    getErrors: vi.fn().mockResolvedValue({ field: 'Joi: required' }),
  },
  Valibot: {
    check: (s: unknown) => Valibot.check(s),
    getErrors: vi.fn().mockResolvedValue({ field: 'Valibot: required' }),
  },
  SuperStruct: {
    check: (s: unknown) => SuperStruct.check(s),
    getErrors: vi.fn().mockResolvedValue({ field: 'Superstruct: required' }),
  },
},
}))
// vi.mock('../src/validators/zod', async (importOriginal) => {
//   const actual = await importOriginal<object>()
//   return {
//     Zod: {
//       ...actual.Zod,
//       getErrors: vi.fn().mockResolvedValue({ field: 'Zod: required' }),
//     },
//   }
// })
// vi.mock('../src/validators/yup', async (importOriginal) => {
//   // const actual = await importOriginal<object>()
//   return {
//     // ...actual,
//     Yup: {
//       getErrors: vi.fn().mockResolvedValue({ field: 'Yup: required' }),
//     },
//   }
// })
// vi.mock('../src/validators/joi', async (importOriginal) => {
//   // const actual = await importOriginal<object>()
//   return {
//     // ...actual,
//     Joi: {
//       getErrors: vi.fn().mockResolvedValue({ field: 'Joi: required' }),
//     },
//   }
// })
// vi.mock('../src/validators/valibot', async (importOriginal) => {
//   // const actual = await importOriginal<object>()
//   return {
//     // ...actual,
//     Valibot: {
//       getErrors: vi.fn().mockResolvedValue({ field: 'Valibot: required' }),
//     },
//   }
// })
// vi.mock('../src/validators/superstruct', async (importOriginal) => {
//   // const actual = await importOriginal<object>()
//   return {
//     // ...actual,
//     SuperStruct: {
//       getErrors: vi.fn().mockResolvedValue({ field: 'Superstruct: required' }),
//     },
//   }
// })

describe('getErrors', () => {
  it('should call getZodErrors for Zod schemas', async () => {
    const schema = z.object({ field: z.string() })
    const form = { field: undefined }
    const errors = await getErrors(schema, form)
    expect(errors).toEqual({ field: 'Zod: required' })
    expect(validators.Zod.getErrors).toHaveBeenCalledWith(schema, form)
  })

  it('should call getYupErrors for Yup schemas', async () => {
    const schema = yup.object({ field: yup.string() })
    const form: yup.InferType<typeof schema> = { field: undefined }
    const errors = await getErrors(schema, form)
    expect(errors).toEqual({ field: 'Yup: required' })
    expect(validators.Yup.getErrors).toHaveBeenCalledWith(schema, form)
  })

  it('should call getJoiErrors for Joi schemas', async () => {
    const schema = joiObject({ field: joiString().required() })
    const form = { field: undefined }
    const errors = await getErrors(schema, form)
    expect(errors).toEqual({ field: 'Joi: required' })
    expect((validators.Joi.getErrors)).toHaveBeenCalledWith(schema, form)
  })

  it('should call getValibotErrors for Valibot schemas', async () => {
    const schema = v.object({ field: v.string() })
    const form = { field: undefined }
    const errors = await getErrors(schema, form)
    expect(errors).toEqual({ field: 'Valibot: required' })
    expect(validators.Valibot.getErrors).toHaveBeenCalledWith(schema, form)
  })

  it('should call getSuperStructErrors for Superstruct schemas', async () => {
    const schema = s.object({ field: s.string() })
    const form = { field: '' }
    const errors = await getErrors(schema, form)
    expect(errors).toEqual({ field: 'Superstruct: required' })
    expect(validators.SuperStruct.getErrors).toHaveBeenCalledWith(schema, form)
  })

  it('should return an empty object for unknown schemas', async () => {
    const invalidSchema = { someProp: 'value' }
    const form = { field: 'value' }
    // @ts-expect-error schema is invalid on purpose
    const errors = await getErrors(invalidSchema, form)
    expect(errors).toEqual({})
  })

  it('should call transformFn when provided', async () => {
    const schema = z.object({ field: z.string() })
    const form = { field: undefined }
    const mockTransformFn = vi.fn().mockResolvedValue({ field: 'Custom error' })
    const errors = await getErrors(schema, form, mockTransformFn)
    expect(mockTransformFn).toHaveBeenCalledWith(schema, form)
    expect(errors).toEqual({ field: 'Custom error' })
  })
})
