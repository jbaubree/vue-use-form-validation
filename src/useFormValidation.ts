import type { FieldErrors, Form, Schema } from './types'
import { computed, type ComputedRef, type MaybeRefOrGetter, type Ref, shallowRef, toValue, watch } from 'vue'
import { getErrors } from './errors'
import { polyfillGroupBy } from './polyfill'

export function useFormValidation<T extends Schema<U>, U extends Form>(
  schema: T,
  form: MaybeRefOrGetter<U>,
  options?: { mode: 'eager' | 'lazy' },
): {
    validate: () => Promise<FieldErrors<U>>
    errors: Ref<FieldErrors<U>>
    errorCount: ComputedRef<number>
    isValid: Ref<boolean>
    hasError: ComputedRef<boolean>
    clearErrors: () => void
    getErrorMessage: (path: keyof U) => string | undefined
    focusFirstErroredInput: () => void
    focusInput: (options: { inputName: keyof U }) => void
  } {
  polyfillGroupBy()
  const opts = Object.assign({}, { mode: 'lazy' }, options)

  const errors = shallowRef<FieldErrors<U>>({})

  const errorCount = computed(() => Object.keys(errors.value).length)
  const isValid = computed(() => !errorCount.value)
  const hasError = computed(() => !!errorCount.value)

  const clearErrors = (): void => {
    errors.value = {}
  }
  const getErrorMessage = (path: keyof U): string | undefined => errors.value[path]

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
    errors.value = await getErrors<T, U>(toValue(schema), toValue(form))
    if (hasError.value) {
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

  if (opts.mode === 'eager') {
    validationWatch()
  }

  return {
    validate,
    errors,
    errorCount,
    isValid,
    hasError,
    clearErrors,
    getErrorMessage,
    focusFirstErroredInput,
    focusInput,
  }
}
