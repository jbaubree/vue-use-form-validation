import { afterEach, describe, expect, it } from 'vitest'
import { getInput, isNonNullObject, setNestedError } from '../src/utils'

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

describe('setNestedError', () => {
  it('should set error on a simple path', () => {
    const errors: Record<string, any> = {}
    setNestedError('username', 'Username is required', errors)
    expect(errors).toEqual({ username: 'Username is required' })
  })

  it('should set error on a nested path', () => {
    const errors: Record<string, any> = {}
    setNestedError('user.name', 'Name is required', errors)
    expect(errors).toEqual({
      user: {
        name: 'Name is required',
      },
    })
  })

  it('should set error on a deeply nested path', () => {
    const errors: Record<string, any> = {}
    setNestedError('user.profile.personal.firstName', 'First name is required', errors)
    expect(errors).toEqual({
      user: {
        profile: {
          personal: {
            firstName: 'First name is required',
          },
        },
      },
    })
  })

  it('should preserve existing nested structure when adding new error', () => {
    const errors: Record<string, any> = {
      user: {
        email: 'Email is invalid',
      },
    }
    setNestedError('user.name', 'Name is required', errors)
    expect(errors).toEqual({
      user: {
        email: 'Email is invalid',
        name: 'Name is required',
      },
    })
  })

  it('should overwrite existing error at the same path', () => {
    const errors: Record<string, any> = {
      user: {
        name: 'Name is too short',
      },
    }
    setNestedError('user.name', 'Name is required', errors)
    expect(errors).toEqual({
      user: {
        name: 'Name is required',
      },
    })
  })

  it('should overwrite non-object values when creating nested path', () => {
    const errors: Record<string, any> = {
      user: 'Some error',
    }
    setNestedError('user.name', 'Name is required', errors)
    expect(errors).toEqual({
      user: {
        name: 'Name is required',
      },
    })
  })

  it('should handle multiple nested errors in different branches', () => {
    const errors: Record<string, any> = {}
    setNestedError('user.name', 'Name is required', errors)
    setNestedError('user.email', 'Email is invalid', errors)
    setNestedError('settings.theme', 'Invalid theme', errors)

    expect(errors).toEqual({
      user: {
        name: 'Name is required',
        email: 'Email is invalid',
      },
      settings: {
        theme: 'Invalid theme',
      },
    })
  })

  it('should handle empty string as error message', () => {
    const errors: Record<string, any> = {}
    setNestedError('field', '', errors)
    expect(errors).toEqual({ field: '' })
  })

  it('should handle paths with single character keys', () => {
    const errors: Record<string, any> = {}
    setNestedError('a.b.c', 'Error message', errors)
    expect(errors).toEqual({
      a: {
        b: {
          c: 'Error message',
        },
      },
    })
  })

  it('should handle numeric-like string keys', () => {
    const errors: Record<string, any> = {}
    setNestedError('items.0.name', 'Item name is required', errors)
    expect(errors).toEqual({
      items: {
        0: {
          name: 'Item name is required',
        },
      },
    })
  })

  it('should modify the original errors object (mutation test)', () => {
    const errors: Record<string, any> = { existing: 'error' }
    const originalReference = errors
    setNestedError('new.field', 'New error', errors)

    expect(errors).toBe(originalReference) // Same reference
    expect(errors).toEqual({
      existing: 'error',
      new: {
        field: 'New error',
      },
    })
  })
})
