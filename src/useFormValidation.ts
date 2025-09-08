import type { ErrorStrategy, FieldErrors, Form, GetErrorsFn, InputSchema, ReturnType, ValidationMode } from './types'
import { computed, getCurrentInstance, type MaybeRefOrGetter, onBeforeUnmount, ref, shallowRef, toValue, watch } from 'vue'
import { getErrors } from './errors'
import { polyfillGroupBy } from './polyfill'
import { getInput } from './utils'

// Overload for deep strategy
export function useFormValidation<S extends InputSchema<F>, F extends Form>(
  schema: S,
  form: MaybeRefOrGetter<F>,
  options: { mode?: ValidationMode, transformFn: GetErrorsFn<S, F>, errorStrategy: 'deep' },
): ReturnType<F, 'deep'>
export function useFormValidation<S extends InputSchema<F>, F extends Form>(
  schema: S,
  form: MaybeRefOrGetter<F>,
  options: { mode?: ValidationMode, errorStrategy: 'deep' },
): ReturnType<F, 'deep'>

// Overload for flatten strategy
export function useFormValidation<S extends InputSchema<F>, F extends Form>(
  schema: S,
  form: MaybeRefOrGetter<F>,
  options: { mode?: ValidationMode, transformFn: GetErrorsFn<S, F>, errorStrategy: 'flatten' },
): ReturnType<F, 'flatten'>
export function useFormValidation<S extends InputSchema<F>, F extends Form>(
  schema: S,
  form: MaybeRefOrGetter<F>,
  options: { mode?: ValidationMode, errorStrategy: 'flatten' },
): ReturnType<F, 'flatten'>

// Default overloads for backwards compatibility
export function useFormValidation<S, F extends Form>(
  schema: S,
  form: MaybeRefOrGetter<F>,
  options: { mode?: ValidationMode, transformFn: GetErrorsFn<S, F>, errorStrategy?: ErrorStrategy },
): ReturnType<F>
export function useFormValidation<S extends InputSchema<F>, F extends Form>(
  schema: S,
  form: MaybeRefOrGetter<F>,
  options?: { mode?: ValidationMode, errorStrategy?: ErrorStrategy },
): ReturnType<F>
export function useFormValidation<S extends InputSchema<F>, F extends Form>(
  schema: S,
  form: MaybeRefOrGetter<F>,
  options?: { mode?: ValidationMode, transformFn?: GetErrorsFn<S, F>, errorStrategy?: ErrorStrategy },
): ReturnType<F> {
  polyfillGroupBy()
  const opts = { mode: 'lazy' as ValidationMode, transformFn: null, errorStrategy: 'flatten' as ErrorStrategy, ...options }

  const errors = shallowRef<FieldErrors<F>>({})
  const isLoading = ref(false)

  // Use WeakMap for memoization cache
  const countCache = new WeakMap<Record<string, unknown>, number>()

  const errorCount = computed(() => {
    const errorsObj = errors.value

    // Check cache first
    if (countCache.has(errorsObj)) {
      return countCache.get(errorsObj)!
    }

    const countErrors = (obj: any): number => {
      let count = 0
      for (const key in obj) {
        if (typeof obj[key] === 'string') {
          count++
        }
        else if (typeof obj[key] === 'object' && obj[key] !== null) {
          count += countErrors(obj[key])
        }
      }
      return count
    }

    const count = countErrors(errorsObj)

    // Cache the result
    countCache.set(errorsObj, count)
    return count
  })
  const isValid = computed(() => !errorCount.value)
  const hasError = computed(() => !!errorCount.value)

  const clearErrors = (): void => {
    errors.value = {}
  }
  const getErrorMessage = (path: keyof F | string): string | undefined => {
    if (typeof path === 'string' && path.includes('.')) {
      // Handle nested path like "user.name"
      const keys = path.split('.')
      let current: any = errors.value
      for (const key of keys) {
        if (current && typeof current === 'object' && key in current) {
          current = current[key]
        }
        else {
          return undefined
        }
      }
      return typeof current === 'string' ? current : undefined
    }
    // Handle direct property access
    const error = errors.value[path as keyof F]
    return typeof error === 'string' ? error : undefined
  }

  // Use WeakMap for memoization cache
  const pathsCache = new WeakMap<Record<string, unknown>, string[]>()

  const errorPaths = computed(() => {
    const errorsObj = errors.value

    // Check cache first
    if (pathsCache.has(errorsObj)) {
      return pathsCache.get(errorsObj)!
    }

    const paths: string[] = []
    const extractPaths = (obj: any, prefix = ''): void => {
      for (const key in obj) {
        const currentPath = prefix ? `${prefix}.${key}` : key
        if (typeof obj[key] === 'string') {
          paths.push(currentPath)
        }
        else if (typeof obj[key] === 'object' && obj[key] !== null) {
          extractPaths(obj[key], currentPath)
        }
      }
    }
    extractPaths(errorsObj)

    // Cache the result
    pathsCache.set(errorsObj, paths)
    return paths
  })

  const validate = async (): Promise<FieldErrors<F>> => {
    isLoading.value = true
    errors.value = await getErrors(schema, form, opts.transformFn, opts.errorStrategy)
    if (hasError.value)
    // eslint-disable-next-line ts/no-use-before-define
      watchFormChanges()
    isLoading.value = false
    return errors.value
  }

  const focusInput = ({ inputName }: { inputName: keyof F | string }): void => {
    getInput(inputName.toString())?.focus()
  }
  const focusFirstErroredInput = (): void => {
    const findFirstErrorPath = (obj: any, prefix = ''): string | null => {
      for (const key in obj) {
        const currentPath = prefix ? `${prefix}.${key}` : key
        if (typeof obj[key] === 'string') {
          return currentPath
        }
        else if (typeof obj[key] === 'object' && obj[key] !== null) {
          const nestedPath = findFirstErrorPath(obj[key], currentPath)
          if (nestedPath)
            return nestedPath
        }
      }
      return null
    }

    const firstErrorPath = findFirstErrorPath(errors.value)
    if (firstErrorPath) {
      focusInput({ inputName: firstErrorPath })
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
      const e = await getErrors(schema, form, opts.transformFn, opts.errorStrategy)
      errors.value[field] = e[field]
      if (hasError.value)
        watchFormChanges()
      isLoading.value = false
    }
  }

  const eventListeners: Array<{ element: HTMLInputElement, handler: () => void }> = []

  if (opts.mode === 'onBlur') {
    Object.keys(toValue(form)).forEach((inputName) => {
      const input = getInput(inputName)
      if (input) {
        const handler = (): Promise<void> => handleBlur(inputName as keyof F)
        input.addEventListener('blur', handler)
        eventListeners.push({ element: input, handler })
      }
    })
  }
  if ((['eager', 'agressive'] as ValidationMode[]).includes(opts.mode)) {
    watchFormChanges(opts.mode === 'agressive')
  }

  const cleanup = (): void => {
    // Remove form watcher
    unwatch?.()
    unwatch = null

    // Remove all event listeners
    eventListeners.forEach(({ element, handler }) => {
      element.removeEventListener('blur', handler)
    })
    eventListeners.length = 0

    // Clear memoization caches by clearing the errors object
    clearErrors()
  }

  // Only register onBeforeUnmount if we're inside a component context
  if (getCurrentInstance()) {
    onBeforeUnmount(() => cleanup())
  }

  return {
    cleanup,
    validate,
    errors,
    errorCount,
    isLoading,
    isValid,
    hasError,
    clearErrors,
    getErrorMessage,
    errorPaths,
    focusFirstErroredInput,
    focusInput,
  }
}
