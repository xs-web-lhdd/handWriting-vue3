import { reactive, isReactive } from '../reactive'

describe('reactive', () => {
  it('happy path', () => {
    const original = { foo: 1 }
    const observecd = reactive(original)

    expect(observecd).not.toBe(original)
    expect(observecd.foo).toBe(1)
    expect(isReactive(observecd)).toBe(true)
    expect(isReactive(original)).toBe(false)
  })

  test('nested reactive', () => {
    const original = {
      nested: {
        foo: 1
      },
      array: [{ bar: 2 }]
    }
    const observed = reactive(original)
    expect(isReactive(observed.nested)).toBe(true)
    expect(isReactive(observed.array)).toBe(true)
    expect(isReactive(observed.array[0])).toBe(true)
  })
})