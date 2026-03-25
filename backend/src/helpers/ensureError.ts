export function ensureError(value: unknown): Error {
  if (value instanceof Error) return value
    const data = JSON.stringify(value)
  return new Error(`This value was thrown as is, not through an Error: ${data}`)
}