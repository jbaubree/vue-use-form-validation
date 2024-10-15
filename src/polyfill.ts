export function polyfillGroupBy<T>(): void {
  if (!Object.groupBy) {
    Object.defineProperty(Object, 'groupBy', {
      value(array: T[], keyGetter: (item: T) => string): Record<string, T[]> {
        return array.reduce((result, currentItem) => {
          const key = keyGetter(currentItem)
          if (!result[key]) {
            result[key] = []
          }
          result[key].push(currentItem)
          return result
        }, {} as Record<string, T[]>)
      },
      writable: true,
      configurable: true,
    })
  }
}
