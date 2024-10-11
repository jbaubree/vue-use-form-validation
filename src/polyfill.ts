export function polyfillGroupBy(): void {
  if (!Object.groupBy) {
    Object.defineProperty(Object, 'groupBy', {
      value(array: any[], keyGetter: (item: any) => string): Record<string, any[]> {
        return array.reduce((result, currentItem) => {
          const key = keyGetter(currentItem)
          if (!result[key]) {
            result[key] = []
          }
          result[key].push(currentItem)
          return result
        }, {} as Record<string, any[]>)
      },
      writable: true,
      configurable: true,
    })
  }
}
