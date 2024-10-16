import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ref, toValue } from 'vue'
import * as z from 'zod'
import type { Ref } from 'vue'
import { getErrors } from '../src/errors'
import { useFormValidation } from '../src/useFormValidation'
import { flushPromises } from './utils/flushPromises'

vi.mock('../src/polyfill', () => ({
  polyfillGroupBy: vi.fn(),
}))
vi.mock('../src/errors', () => ({
  getErrors: vi.fn(),
}))

describe('useFormValidation', () => {
  let schema: z.ZodObject<{
    field1: z.ZodString
    field2: z.ZodString
  }>
  let form: Ref<Partial<z.infer<typeof schema>>>

  beforeEach(() => {
    schema = z.object({
      field1: z.string().min(1, 'field1 is required'),
      field2: z.string().email('Invalid field2'),
    })
    form = ref({
      field1: '',
      field2: '',
    })
    vi.clearAllMocks()
  })

  it('should initialize with no errors', () => {
    const { errors, isValid, errorCount } = useFormValidation(schema, form)
    expect(errors.value).toEqual({})
    expect(isValid.value).toBe(true)
    expect(errorCount.value).toBe(0)
  })

  it('should call getErrors and update errors after validation', async () => {
    const mockErrors = { field1: 'Required' }
    vi.mocked(getErrors).mockResolvedValue(mockErrors)
    const { validate, errors, isValid, errorCount } = useFormValidation(schema, form)
    await validate()
    expect(getErrors).toHaveBeenCalledWith(schema, toValue(form))
    expect(errors.value).toEqual(mockErrors)
    expect(isValid.value).toBe(false)
    expect(errorCount.value).toBe(1)
  })

  it('should clear errors when clearErrors is called', async () => {
    const mockErrors = { field1: 'Required' }
    vi.mocked(getErrors).mockResolvedValue(mockErrors)
    const { validate, clearErrors, errors } = useFormValidation(schema, form)
    await validate()
    expect(errors.value).toEqual(mockErrors)
    clearErrors()
    expect(errors.value).toEqual({})
  })

  it('should focus the first errored input', async () => {
    document.body.innerHTML = `
      <input name="field1" />
      <input name="field2" />
    `

    const mockErrors = { field1: 'Required' }
    vi.mocked(getErrors).mockResolvedValue(mockErrors)
    const { validate, focusFirstErroredInput } = useFormValidation(schema, form)
    await validate()
    const input: HTMLInputElement | null = document.querySelector('input[name="field1"]')
    expect(input).toBeDefined()
    const focusSpy = vi.spyOn(input as HTMLInputElement, 'focus')
    focusFirstErroredInput()
    expect(focusSpy).toHaveBeenCalled()
  })

  it('should focus the input when focusInput is called with inputName', () => {
    document.body.innerHTML = `
      <input name="field1" />
      <input name="field2" />
    `

    const { focusInput } = useFormValidation(schema, form)
    const input: HTMLInputElement | null = document.querySelector('input[name="field1"]')
    expect(input).toBeDefined()
    const focusSpy = vi.spyOn(input as HTMLInputElement, 'focus')
    focusInput({ inputName: 'field1' })
    expect(focusSpy).toHaveBeenCalled()
  })

  it('should validate automatically in eager mode', async () => {
    const mockErrors = { field1: 'Required' }
    vi.mocked(getErrors).mockResolvedValue(mockErrors)
    const { errors, isValid, errorCount } = useFormValidation(schema, form, { mode: 'eager' })
    form.value.field1 = undefined
    await flushPromises()
    expect(errors.value).toEqual({ field1: 'Required' })
    expect(isValid.value).toBe(false)
    expect(errorCount.value).toBe(1)
    expect(getErrors).toHaveBeenCalledWith(schema, toValue(form))
  })

  it('should update errors in real-time when form changes in eager mode', async () => {
    const mockErrorsInitial = { field1: 'Required' }
    const mockErrorsUpdated = { field2: 'Invalid field2' }
    vi.mocked(getErrors)
      .mockResolvedValueOnce(mockErrorsInitial)
      .mockResolvedValueOnce(mockErrorsUpdated)
    const { errors, validate } = useFormValidation(schema, form, { mode: 'eager' })
    await validate()
    expect(errors.value).toEqual(mockErrorsInitial)
    form.value.field1 = 'Updated'
    form.value.field2 = 'Invalid'
    await flushPromises()
    expect(errors.value).toEqual(mockErrorsUpdated)
  })
})
