export function polyfillGroupBy<T>(): void {
  if (!Object.groupBy) {
    Object.defineProperty(Object, 'groupBy', {
      value: (array: T[], keyGetter: (item: T) => string): Record<string, T[]> => array.reduce((result: Record<string, T[]>, item: T) => {
        const key = keyGetter(item);
        (result[key] ??= []).push(item)
        return result
      }, {}),
      writable: true,
      configurable: true,
    })
  }
}
