import { afterEach, describe, expect, it } from 'vitest'
import { getInput, isNonNullObject } from '../src/utils'

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

describe('getInput', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('should return the input element with the specified name', () => {
    const inputName = 'testInput'
    const inputElement = document.createElement('input')
    inputElement.setAttribute('name', inputName)
    document.body.appendChild(inputElement)
    const result = getInput(inputName)
    expect(result).toBe(inputElement)
  })

  it('should return null if there is no input element with the specified name', () => {
    const result = getInput('nonExistentInput')
    expect(result).toBeNull()
  })

  it('should return null if the input element has a different name', () => {
    const inputElement = document.createElement('input')
    inputElement.setAttribute('name', 'differentName')
    document.body.appendChild(inputElement)
    const result = getInput('testInput')
    expect(result).toBeNull()
  })
})
