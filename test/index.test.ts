import { describe, expect, it } from 'vitest'
import { useFormValidation } from '../src/index'

describe('index.ts', () => {
  it('should export useFormValidation', () => {
    expect(typeof useFormValidation).toBe('function')
  })
})
