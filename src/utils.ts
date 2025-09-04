export function isNonNullObject(obj: unknown): obj is Record<string, unknown> {
  return typeof obj === 'object' && obj !== null
}

export function getInput(inputName: string): HTMLInputElement | null {
  return document.querySelector(`input[name="${inputName}"]`)
}

export function setNestedError(
  path: string,
  message: string,
  errors: Record<string, any>,
): void {
  const keys = path.split('.')
  let current = errors

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]
    if (!current[key] || typeof current[key] !== 'object') {
      current[key] = {}
    }
    current = current[key]
  }
  const finalKey = keys[keys.length - 1]
  current[finalKey] = message
}
