export function arrayRandom<T>(array: T[]): T {
  return array.at(Math.floor(Math.random() * array.length)) as T
}