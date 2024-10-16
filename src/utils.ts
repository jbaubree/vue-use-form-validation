export function isNonNullObject(obj: unknown): obj is Record<string, unknown> {
  return typeof obj === 'object' && obj !== null
}
