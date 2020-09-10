const parse = require('../index').interpret()

const lisp = (...e) =>
  parse(e.length > 1
    ? e.unshift('do') && e
    : typeof e[0] === 'string' ? e : e[0])

describe('Basics', () => {
  it('funcs and args are the same as JS', () => {
    expect(lisp([parseInt, '4.41'])).toBe(4)

    expect(lisp([isNaN, 103])).toBe(false)

    const sum = (...args) => args.reduce((a, b) => a + b, 0)

    expect(lisp([sum, 2, 3])).toBe(5)
  })

  it('nesting', () => {
    const sum = (...args) => args.reduce((a, b) => a + b, 0)

    expect(lisp([sum, [sum, 1, 2], [sum, 3, 4]])).toBe(10)
  })

  it('scope', () => {
    expect(lisp(
      ['defn', 'test', [],
        ['def', 'x', 1]],
      ['test'],
      ['if', ['=', 'x', 1],
        ['print', 'dirty'],
        ['print', 'clean']]
    )).toBe('clean')
  })
})

describe('Output', () => {
  it('print', () => {
    expect(lisp(['print'])).toBe('')
    expect(lisp(['print', 'hello'])).toBe('hello')
    expect(lisp(['print', 'hello', ' ', 'world'])).toBe('hello world')
  })

  it('out', () => {
    expect(lisp(['out'])).toEqual([])
    expect(lisp(['out', 1])).toBe(1)
    expect(lisp(['out', ['quote', []]])).toEqual([])
    expect(lisp(['out', 1, 2])).toEqual([1, 2])
  })
})

describe('Special Forms', () => {
  it('def', () => {
    expect(lisp(['def', 'a', true])).toBe(true)
    expect(lisp(['def', 'list', [1, 2, 3]])).toEqual([1, 2, 3])
  })

  it('do', () => {
    expect(lisp(
      ['do',
        ['def', 'a', 2],
        ['out', 'a']]
    )).toBe(2)
  })

  it('fn', () => {
    expect(lisp(
      ['def', 'shout',
        ['fn', ['planet', 'greeting'],
          ['print', 'greeting', ' ', 'planet']]],
      ['shout', 'world', 'hello']
    )).toBe('hello world')
  })

  it('defn', () => {
    expect(lisp(
      ['defn', 'greeting', ['name'],
        ['print', 'Hello, ', 'name']],
      ['greeting', 'Dan']
    )).toBe('Hello, Dan')
  })

  it('if', () => {
    expect(lisp(
      ['if', true, true, false]
    )).toBe(true)

    expect(lisp(
      ['if', false, true, false]
    )).toBe(false)
  })

  it('spread', () => {
    expect(lisp(
      ['defn', 'sum', ['a', 'b', 'c'],
        ['+', 'a', 'b', 'c']],
      ['def', 'list', [1, 2, 3]],
      ['spread', 'sum', 'list']
    )).toBe(6)
  })

  it('quote', () => {
    expect(lisp(['quote'])).toBeUndefined()
    expect(lisp(['quote', 'def'])).toBe('def')
    expect(lisp(['quote', 1, 2])).toBe(1)
  })

  it('defmacro', () => {
    expect(lisp(
      ['defmacro', 'flip', ['expr'],
        ['expand', ['reverse', 'expr']]],
      ['flip', 3, 'print']
    )).toEqual(lisp(['print', 3]))
  })
})

describe('Built-in', () => {
  it('isFinite', () => {
    expect(lisp(['isFinite', 0])).toBe(true)
    expect(lisp(['isFinite', Infinity])).toBe(false)
  })

  it('isNaN', () => {
    expect(lisp(['isNaN', NaN])).toBe(true)
    expect(lisp(['isNaN', 0])).toBe(false)
  })

  it('parseFloat', () => {
    expect(lisp(['parseFloat', '4.21'])).toBe(4.21)
  })

  it('parseInt', () => {
    expect(lisp(['parseInt', 4.21])).toBe(4)
  })

  it('typeof', () => {
    expect(lisp(['typeof', ''])).toBe('string')
    expect(lisp(['typeof', 1])).toBe('number')
    expect(lisp(['typeof', true])).toBe('boolean')
    expect(lisp(['typeof', {}])).toBe('object')
    expect(lisp(['typeof', undefined])).toBe('undefined')
  })

  it('instanceof', () => {
    expect(lisp(
      ['instanceof', [], ['.', [], ['quote', 'constructor']]]
    )).toBe(true)
  })
})

describe('Comparison', () => {
  it('=', () => {
    expect(lisp(['='])).toBeUndefined()
    expect(lisp(['=', 0])).toBeUndefined()
    expect(lisp(['=', true, true])).toBe(true)
    expect(lisp(['=', true, false])).toBe(false)
  })

  it('!=', () => {
    expect(lisp(['!='])).toBeUndefined()
    expect(lisp(['!=', 0])).toBeUndefined()
    expect(lisp(['!=', true, true])).toBe(false)
    expect(lisp(['!=', true, false])).toBe(true)
  })

  it('<', () => {
    expect(lisp(['<'])).toBeUndefined()
    expect(lisp(['<', 0])).toBeUndefined()
    expect(lisp(['<', 1, 0])).toBe(false)
    expect(lisp(['<', 1, 1])).toBe(false)
    expect(lisp(['<', 0, 1])).toBe(true)
  })

  it('<=', () => {
    expect(lisp(['<='])).toBeUndefined()
    expect(lisp(['<=', 0])).toBeUndefined()
    expect(lisp(['<=', 1, 0])).toBe(false)
    expect(lisp(['<=', 1, 1])).toBe(true)
    expect(lisp(['<=', 0, 1])).toBe(true)
  })

  it('>', () => {
    expect(lisp(['>'])).toBeUndefined()
    expect(lisp(['>', 0])).toBeUndefined()
    expect(lisp(['>', 1, 0])).toBe(true)
    expect(lisp(['>', 1, 1])).toBe(false)
    expect(lisp(['>', 0, 1])).toBe(false)
  })

  it('>=', () => {
    expect(lisp(['>='])).toBeUndefined()
    expect(lisp(['>=', 0])).toBeUndefined()
    expect(lisp(['>=', 1, 0])).toBe(true)
    expect(lisp(['>=', 1, 1])).toBe(true)
    expect(lisp(['>=', 0, 1])).toBe(false)
  })
})

describe('Binary', () => {
  it('not', () => {
    expect(lisp(['not'])).toBeUndefined()
    expect(lisp(['not', true])).toBe(false)
    expect(lisp(['not', ['not', true]])).toBe(true)
  })

  it('and', () => {
    expect(lisp(['and'])).toBeUndefined()
    expect(lisp(['and', true])).toBeUndefined()
    expect(lisp(['and', true, true])).toBe(true)
    expect(lisp(['and', true, false])).toBe(false)
    expect(lisp(['and', false, false])).toBe(false)
  })

  it('or', () => {
    expect(lisp(['or'])).toBeUndefined()
    expect(lisp(['or', true])).toBeUndefined()
    expect(lisp(['or', true, true])).toBe(true)
    expect(lisp(['or', true, false])).toBe(true)
    expect(lisp(['or', false, false])).toBe(false)
  })
})

describe('Arithmetic', () => {
  it('+', () => {
    expect(lisp(['+'])).toBeUndefined()
    expect(lisp(['+', -1])).toBe(1)
    expect(lisp(['+', 1, 2])).toBe(3)

    expect(lisp(['+', '1', '2'])).toBe('12')
  })

  it('-', () => {
    expect(lisp(['-'])).toBeUndefined()
    expect(lisp(['-', 1])).toBe(-1)
    expect(lisp(['-', 2, 1])).toBe(1)
  })

  it('*', () => {
    expect(lisp(['*'])).toBeUndefined()
    expect(lisp(['*', 2])).toBe(2)
    expect(lisp(['*', 2, 2])).toBe(4)
  })

  it('/', () => {
    expect(lisp(['/'])).toBeUndefined()
    expect(lisp(['/', 2])).toBe(2)
    expect(lisp(['/', 4, 2])).toBe(2)
  })

  it('^', () => {
    expect(lisp(['^'])).toBeUndefined()
    expect(lisp(['^', 2])).toBe(2)
    expect(lisp(['^', 2, 3])).toBe(8)
  })
})

describe('macro', () => {
  it('->a', () => {
    expect(lisp(
      ['->a', 3,
        ['+', 7],
        ['-', 11]]
    )).toBe(-1)
  })

  it('->>', () => {
    expect(lisp(
      ['->>', 3,
        ['+', 7],
        ['-', 11]]
    )).toBe(1)
  })
})

describe('other', () => {
  it('get', () => {
    expect(lisp(['get', [1, 2, 3], 1])).toBe(2)
    expect(lisp(['get', [], ['quote', 'slice']])).toBe([].slice)
  })

  it('call', () => {
    // expect(lisp(
    //   ['do',
    //     ['defn', 'printStr', ['str'], ['print', 'str']],
    //     ['call', 'printStr', '', ['hello']]]
    // )).toBe('hello')

    expect(lisp(
      ['defn', 'sliceList', ['list', 'args'],
        ['call', ['get', [], ['quote', 'slice']], 'list', 'args']],

      ['def', 'list', [1, 2, 3]],
      ['sliceList', 'list', 1]
    )).toEqual([2, 3])
  })
})

describe('list', () => {
  it('first', () => {
    expect(lisp(['first', [1, 2, 3]])).toBe(1)
  })

  it('last', () => {
    expect(lisp(['last', [1, 2, 3]])).toBe(3)
  })

  it('nth', () => {
    expect(lisp(['nth', [1, 2, 3], 1])).toBe(2)
  })

  it('push', () => {
    expect(lisp(['push', ['quote', []], 1])).toBe(1)
    expect(lisp(
      ['def', 'list', [1]],
      ['push', 'list', 2],
      ['out', 'list']
    )).toEqual([1, 2])
  })

  it('pop', () => {
    expect(lisp(['pop', [1, 2, 3]])).toEqual(3)
    expect(lisp(
      ['def', 'list', [1, 2, 3]],
      ['pop', 'list'],
      ['out', 'list']
    )).toEqual([1, 2])
  })

  it('shift', () => {
    expect(lisp(['shift', [1, 2, 3]])).toEqual(1)
    expect(lisp(
      ['def', 'list', [1, 2, 3]],
      ['shift', 'list'],
      ['out', 'list']
    )).toEqual([2, 3])
  })

  it('unshift', () => {
    expect(lisp(['unshift', ['quote', []], 1])).toBe(1)
    expect(lisp(
      ['def', 'list', [2, 3]],
      ['unshift', 'list', 1],
      ['out', 'list']
    )).toEqual([1, 2, 3])
  })

  it('slice', () => {
    expect(lisp(['slice', [1, 2, 3], 1])).toEqual([2, 3])
  })

  it('splice', () => {
    expect(lisp(
      ['def', 'list', [1, 2, 3]],
      ['splice', 'list', 1],
      ['out', 'list']
    )).toEqual([1])
  })

  it('concat', () => {
    expect(lisp(['concat', [1], [2]])).toEqual([1, 2])
  })
})

describe('alias', () => {
  it('general', () => {
    // expect(lisp(['=', '!', 'not'])).toBe(true)
    // expect(lisp(['=', '^', '**'])).toBe(true)
  })
})
