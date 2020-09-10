const curry = require('../curry')

describe('curry', () => {
  it('fully chains', () => {
    const add = curry((a, b, c) => a + b + c)

    expect(add(2)(2)(2)).toEqual(6)
  })

  it('partial application', () => {
    const add = curry((a, b, c) => a + b + c)
    const add2 = add(2)

    expect(add2(2)(2)).toEqual(6)
  })

  it('partial application can be reused', () => {
    const add = curry((a, b, c) => a + b + c)
    const add2 = add(2)

    expect(add2(2)(2)).toEqual(6)
    expect(add2(2)(3)).toEqual(7)
  })

  it('multiple arguments', () => {
    const times = curry((a, b, c) => a * b * c)

    expect(times(2, 3, 4)).toEqual(24)
    expect(times(2)(3, 4)).toEqual(24)
    expect(times(2, 3)(4)).toEqual(24)
    expect(times(2)(3)(4)).toEqual(24)
  })
})
