import { isReadonly, isShallow, shallowReadonly } from '../reactive';

describe('shallowReadonly', () => {
  test('should not make non-reactive properties reactive', () => {
    const props = shallowReadonly({ n: { foo: 1 } })
    expect(isReadonly(props)).toBe(true)
    expect(isReadonly(props.n)).toBe(false)
    expect(isShallow(props)).toBe(true)
  })

  test('isShallow', () => {
    // expect(isShallow(shallowReactive({}))).toBe(true)
    expect(isShallow(shallowReadonly({}))).toBe(true)
  })

  it('should call console.warn when set', () => {
    console.warn = jest.fn()

    const user = shallowReadonly({
      age: 10
    })

    user.age = 11

    expect(console.warn).toBeCalled()
  })
})