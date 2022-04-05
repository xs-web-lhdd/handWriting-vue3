import { reactive } from '../reactive'

describe('reactive', () => {
  it('happy path', () => {
    const original = { foo: 1 }
    const observecd = reactive(original)

    expect(observecd).not.toBe(original)
    expect(observecd.foo).toBe(1)
  })
})