export const extend = Object.assign
export function isObject(val) {
  return typeof val === 'object' && val !== null
}
export function hasChance(val, newVal) {
  return !Object.is(val, newVal)
}