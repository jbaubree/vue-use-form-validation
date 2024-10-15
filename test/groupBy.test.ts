import { beforeEach, describe, expect, it, vi } from 'vitest'
import { polyfillGroupBy } from '../src/polyfill'

describe('polyfillGroupBy', () => {
  beforeEach(() => {
    if ('groupBy' in Object) {
      delete (Object as { groupBy?: unknown }).groupBy
    }
    polyfillGroupBy()
  })

  it('should define Object.groupBy if not already defined', () => {
    expect(Object.groupBy).toBeDefined()
  })

  it('should group array of objects by a given key', () => {
    const array = [
      { id: 1, category: 'fruit', name: 'apple' },
      { id: 2, category: 'vegetable', name: 'carrot' },
      { id: 3, category: 'fruit', name: 'banana' },
    ]
    const result = Object.groupBy(array, item => item.category)
    expect(result).toEqual({
      fruit: [
        { id: 1, category: 'fruit', name: 'apple' },
        { id: 3, category: 'fruit', name: 'banana' },
      ],
      vegetable: [{ id: 2, category: 'vegetable', name: 'carrot' }],
    })
  })

  it('should return an empty object for an empty array', () => {
    const result = Object.groupBy([], () => 'key')
    expect(result).toEqual({})
  })

  it('should group by a dynamic key', () => {
    const array = [
      { id: 1, category: 'fruit', name: 'apple' },
      { id: 2, category: 'fruit', name: 'banana' },
      { id: 3, category: 'vegetable', name: 'carrot' },
    ]
    const result = Object.groupBy(array, item => item.name[0])
    expect(result).toEqual({
      a: [{ id: 1, category: 'fruit', name: 'apple' }],
      b: [{ id: 2, category: 'fruit', name: 'banana' }],
      c: [{ id: 3, category: 'vegetable', name: 'carrot' }],
    })
  })

  it('should not overwrite existing Object.groupBy', () => {
    Object.groupBy = vi.fn()
    polyfillGroupBy()
    expect(Object.groupBy).toBeInstanceOf(Function)
    expect(Object.groupBy).toHaveBeenCalledTimes(0)
  })
})
