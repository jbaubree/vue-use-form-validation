import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { z } from 'zod'
import type { Ref } from 'vue'
import { useFormValidation } from '../src/useFormValidation'

describe('useFormValidation', () => {
  let schema: z.ZodObject<{
    name: z.ZodString
    email: z.ZodString
  }>
  let form: Ref<z.infer<typeof schema>>

  beforeEach(() => {
    schema = z.object({
      name: z.string().min(1, 'Name is required'),
      email: z.string().email('Invalid email'),
    })
    form = ref({
      name: '',
      email: '',
    })
  })

  it('should return no errors when form is valid', async () => {
    form.value = { name: 'John', email: 'john@example.com' }
    const { validate, errors, isValid } = useFormValidation(schema, form)
    await validate()
    expect(errors.value).toStrictEqual({})
    expect(isValid.value).toBe(true)
  })

  it('should return errors when form is invalid', async () => {
    form.value = { name: '', email: 'invalid-email' }
    const { validate, errors, isValid, getErrorMessage } = useFormValidation(schema, form)
    await validate()
    expect(isValid.value).toBe(false)
    expect(errors.value).toHaveProperty('name')
    expect(errors.value).toHaveProperty('email')
    expect(getErrorMessage('name')).toBe('Name is required')
    expect(getErrorMessage('email')).toBe('Invalid email')
  })

  it('should clear errors when clearErrors is called', async () => {
    form.value = { name: '', email: 'invalid-email' }
    const { validate, errors, clearErrors } = useFormValidation(schema, form)
    await validate()
    expect(errors.value).toHaveProperty('name')
    clearErrors()
    expect(errors.value).toStrictEqual({})
  })

  it('should focus the first errored input', async () => {
    form.value = { name: '', email: 'invalid-email' }
    const { validate, focusFirstErroredInput } = useFormValidation(schema, form)
    const focusMock = vi.fn()
    vi.spyOn(document, 'querySelector').mockReturnValue({ focus: focusMock } as unknown as HTMLInputElement)
    await validate()
    focusFirstErroredInput()
    expect(focusMock).toHaveBeenCalled()
  })

  it('should focus a specific input when focusInput is called', () => {
    const { focusInput } = useFormValidation(schema, form)
    const focusMock = vi.fn()
    vi.spyOn(document, 'querySelector').mockReturnValue({ focus: focusMock } as unknown as HTMLInputElement)
    focusInput({ inputName: 'name' })
    expect(focusMock).toHaveBeenCalled()
  })
})
