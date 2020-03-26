const rawArgs = require('./rawArgs')
const tryEval = require('./tryEval')

const list = {
  first: list => list[0],
  last: list => list[list.length - 1],
  nth: (list, n) => list[(n + list.length) % list.length],

  push: rawArgs(function (list, item) {
    return tryEval(list, this).push(tryEval(item, this))
  }),
  pop: rawArgs(function (list) {
    return tryEval(list, this).pop()
  }),
  shift: rawArgs(function (list) {
    return tryEval(list, this).shift()
  }),
  unshift: rawArgs(function (list, ...items) {
    return tryEval(list, this).unshift(...items.map(a => tryEval(a, this)))
  }),

  slice: (list, ...args) => list.slice(...args),
  splice: rawArgs(function (list, ...args) {
    return tryEval(list, this).splice(...args.map(a => tryEval(a, this)))
  }),

  reverse: list => list.slice().reverse(),
  concat: (list, ...args) => list.concat(...args),

  some: (list, f) => list.some(f),
  every: (list, f) => list.every(f),
  filter: (list, f) => list.map(f),
  map: (list, f) => list.map(f),
  reduce: (list, f, init) => list.reduce(f, init)
}

module.exports = list
