import { computed, type ComputedRef, type MaybeRefOrGetter, type Ref, ref, toValue, watch } from 'vue'
import type { ZodTypeAny } from 'zod'
import { polyfillGroupBy } from './polyfill'
import type { FieldErrors } from './types'

export function useFormValidation<T extends MaybeRefOrGetter<ZodTypeAny>, U extends Record<string, unknown>>(
  schema: T,
  form: MaybeRefOrGetter<U>,
  options?: { mode: 'eager' | 'lazy' },
): {
    validate: () => Promise<FieldErrors<U>>
    errors: Ref<FieldErrors<U>>
    errorCount: ComputedRef<number>
    isValid: Ref<boolean>
    hasError: ComputedRef<boolean>
    clearErrors: () => null
    getErrorMessage: (path: keyof U) => string | undefined
    focusFirstErroredInput: () => void
    focusInput: (options: { inputName: keyof U }) => void
  } {
  polyfillGroupBy()
  const opts = Object.assign({}, { mode: 'lazy' }, options)

  const isValid = ref(true)
  const errors = ref<FieldErrors<U>>(null)

  const errorCount = computed(() => Object.keys(errors.value || {}).length)
  const hasError = computed(() => !!errorCount.value)

  const clearErrors = (): null => (errors.value = null)
  const getErrorMessage = (path: keyof U): string | undefined => errors.value?.[path]?.[0]?.message

  let unwatch: null | (() => void) = null
  const validationWatch: () => void = () => {
    if (unwatch !== null)
      return
    unwatch = watch(
      () => toValue(form),
      async () => {
        // eslint-disable-next-line ts/no-use-before-define
        await validate()
      },
      { deep: true },
    )
  }

  const validate = async (): Promise<FieldErrors<U>> => {
    clearErrors()
    const result = await toValue(schema).safeParseAsync(toValue(form))
    isValid.value = result.success
    if (!result.success) {
      errors.value = Object.groupBy(result.error.issues, item => item.path[0])
      validationWatch()
    }
    return errors.value
  }

  const focusInput = ({ inputName }: { inputName: keyof U }): void => {
    const element: HTMLInputElement | null = document.querySelector(`input[name="${inputName.toString()}"]`)
    element?.focus()
  }
  const focusFirstErroredInput = (): void => {
    for (const key in toValue(form)) {
      if (key in errors.value) {
        focusInput({ inputName: key })
        break
      }
    }
  }

  if (opts.mode === 'eager')
    validationWatch()

  return {
    validate,
    errors: errors as ComputedRef<FieldErrors<U>>,
    errorCount,
    isValid,
    hasError,
    clearErrors,
    getErrorMessage,
    focusFirstErroredInput,
    focusInput,
  }
}
