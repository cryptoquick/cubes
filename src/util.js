export const time = (fn, name = 'a function') => {
  const start = Date.now()
  const result = fn()
  const end = Date.now()
  console.log(`${name} took ${end - start}ms to run.`)
  return result
}
