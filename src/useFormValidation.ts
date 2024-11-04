import type { FieldErrors, Form, GetErrorsFn, InputSchema, ReturnType } from './types'
import { computed, type MaybeRefOrGetter, ref, shallowRef, toValue, watch } from 'vue'
import { getErrors } from './errors'
import { polyfillGroupBy } from './polyfill'

export function useFormValidation<S, F extends Form>(
  schema: S,
  form: MaybeRefOrGetter<F>,
  options: { mode?: 'eager' | 'lazy', transformFn: GetErrorsFn<S, F> },
): ReturnType<F>
export function useFormValidation<S extends InputSchema<F>, F extends Form>(
  schema: S,
  form: MaybeRefOrGetter<F>,
  options?: { mode?: 'eager' | 'lazy' },
): ReturnType<F>
export function useFormValidation<S extends InputSchema<F>, F extends Form>(
  schema: S,
  form: MaybeRefOrGetter<F>,
  options?: { mode?: 'eager' | 'lazy', transformFn?: GetErrorsFn<S, F> },
): ReturnType<F> {
  polyfillGroupBy()
  const opts = { mode: 'lazy', transformFn: null, ...options }

  const errors = shallowRef<FieldErrors<F>>({})

  const isLoading = ref(false)

  const errorCount = computed(() => Object.keys(errors.value).length)
  const isValid = computed(() => !errorCount.value)
  const hasError = computed(() => !!errorCount.value)

  const clearErrors = (): void => {
    errors.value = {}
  }
  const getErrorMessage = (path: keyof F): string | undefined => errors.value[path]

  const validate = async (): Promise<FieldErrors<F>> => {
    isLoading.value = true
    clearErrors()
    errors.value = opts.transformFn
      ? await getErrors<S, F>(toValue(schema), toValue(form), opts.transformFn)
      : await getErrors<S, F>(toValue(schema), toValue(form))

    if (hasError.value)
    // eslint-disable-next-line ts/no-use-before-define
      watchFormChanges()
    isLoading.value = false
    return errors.value
  }

  const focusInput = ({ inputName }: { inputName: keyof F }): void => {
    (document.querySelector(`input[name="${inputName.toString()}"]`) as HTMLInputElement | null)?.focus()
  }
  const focusFirstErroredInput = (): void => {
    for (const key in toValue(form)) {
      if (key in errors.value) {
        focusInput({ inputName: key })
        break
      }
    }
  }

  let unwatch: null | (() => void)
  const watchFormChanges = (): void | (() => void) => {
    if (!unwatch)
      unwatch = watch(() => toValue(form), validate, { deep: true })
  }

  if (opts.mode === 'eager')
    watchFormChanges()

  return {
    validate,
    errors,
    errorCount,
    isLoading,
    isValid,
    hasError,
    clearErrors,
    getErrorMessage,
    focusFirstErroredInput,
    focusInput,
  }
}
