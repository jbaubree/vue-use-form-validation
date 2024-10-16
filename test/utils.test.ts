import { describe, expect, it } from 'vitest'
import { isNonNullObject } from '../src/utils'

describe('isNonNullObject', () => {
  it('should return true for non-null objects', () => {
    expect(isNonNullObject({})).toBe(true)
    expect(isNonNullObject({ key: 'value' })).toBe(true)
  })

  it('should return false for null', () => {
    expect(isNonNullObject(null)).toBe(false)
  })

  it('should return false for non-object types', () => {
    expect(isNonNullObject(123)).toBe(false)
    expect(isNonNullObject('string')).toBe(false)
    expect(isNonNullObject(undefined)).toBe(false)
    expect(isNonNullObject(true)).toBe(false)
  })

  it('should return false for arrays', () => {
    expect(isNonNullObject([])).toBe(true)
    expect(isNonNullObject([1, 2, 3])).toBe(true)
  })

  it('should return true for instances of objects', () => {
    class TestClass {}
    expect(isNonNullObject(new TestClass())).toBe(true)
  })
})
