export const name = (name: string): boolean => (
  name &&
  typeof name === 'string' &&
  name.length >= 1 &&
  name.length <= 32 
)
