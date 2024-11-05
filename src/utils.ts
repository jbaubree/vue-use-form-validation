export function isNonNullObject(obj: unknown): obj is Record<string, unknown> {
  return typeof obj === 'object' && obj !== null
}

export function getInput(inputName: string): HTMLInputElement | null {
  return document.querySelector(`input[name="${inputName}"]`)
}
