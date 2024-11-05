import type { FieldErrors, Form, GetErrorsFn, InputSchema, ReturnType, ValidationMode } from './types'
import { computed, type MaybeRefOrGetter, ref, shallowRef, toValue, watch } from 'vue'
import { getErrors } from './errors'
import { polyfillGroupBy } from './polyfill'
import { getInput } from './utils'

export function useFormValidation<S, F extends Form>(
  schema: S,
  form: MaybeRefOrGetter<F>,
  options: { mode?: ValidationMode, transformFn: GetErrorsFn<S, F> },
): ReturnType<F>
export function useFormValidation<S extends InputSchema<F>, F extends Form>(
  schema: S,
  form: MaybeRefOrGetter<F>,
  options?: { mode?: ValidationMode },
): ReturnType<F>
export function useFormValidation<S extends InputSchema<F>, F extends Form>(
  schema: S,
  form: MaybeRefOrGetter<F>,
  options?: { mode?: ValidationMode, transformFn?: GetErrorsFn<S, F> },
): ReturnType<F> {
  polyfillGroupBy()
  const opts = { mode: 'lazy' as ValidationMode, transformFn: null, ...options }

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
    errors.value = await getErrors(schema, form, opts.transformFn)

    if (hasError.value)
    // eslint-disable-next-line ts/no-use-before-define
      watchFormChanges()
    isLoading.value = false
    return errors.value
  }

  const focusInput = ({ inputName }: { inputName: keyof F }): void => {
    getInput(inputName.toString())?.focus()
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
  const watchFormChanges = (immediate = false): void | ((immediate?: boolean) => void) => {
    if (!unwatch)
      unwatch = watch(() => toValue(form), validate, { deep: true, immediate })
  }

  const handleBlur = async (field: keyof F): Promise<void> => {
    if (opts.mode === 'onBlur') {
      isLoading.value = true
      const e = await getErrors(schema, form, opts.transformFn)
      errors.value[field] = e[field]
      if (hasError.value)
        watchFormChanges()
      isLoading.value = false
    }
  }

  if (opts.mode === 'onBlur') {
    Object.keys(toValue(form)).forEach((inputName) => {
      getInput(inputName)?.addEventListener('blur', () => handleBlur(inputName as keyof F))
    })
  }
  if ((['eager', 'agressive'] as ValidationMode[]).includes(opts.mode)) {
    watchFormChanges(opts.mode === 'agressive')
  }

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
