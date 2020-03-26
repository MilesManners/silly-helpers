/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
const evaluate = require('./evaluate')
const macro = require('./native/macro')
const rawArgs = require('./native/rawArgs')
const specialForm = require('./native/specialForm')
const { req } = require('./native/restrictions')
const native = require('./native/native')
const tryEval = require('./native/tryEval')

const parse = require('./index').interpret({})

const input = JSON.parse(require('fs').readFileSync(require('path').join(__dirname, 'input.json')))
parse(input)//?

const lisp = (...e) => parse(e.length > 1 ? e.unshift('do') && e : typeof e[0] === 'string' ? e : e[0])

lisp(
  ['some', [1, 2, 3, 4, 5], ['fn', ['x'], ['<', 'x', 3]]]
)//?

// lisp(
//   ['defn', 'sum', ['list'],
//     ['if', ['>', ['.', 'list', 'length'], 1],
//       ['+',
//         ['.', 'list', 0],
//         ['sum', ['slice', 'list', 1]]],
//       ['.', 'list', 0]]],

//   ['def', 'list', [1, 2, 3]],
//   ['sum', 'list']
// )//?

// lisp(
//   ['def', 'list', [1, 2, 3]],
//   ['expand', ['reduce', 'list', ['fn', ['acc', 'cur'], ['+', 'acc', 'cur']], 0]]
// )//?

// lisp(
//   ['def', 'list', [1]],
//   ['call', ['.', [], ['quote', 'push']], 'list', 2],
//   ['out', 'list']
// )//?

// lisp(
//   ['do',
//     ['defn', 'fib', ['n'],
//       ['if', ['>', 'n', 1],
//         ['+',
//           ['fib', ['-', 'n', 1]],
//           ['fib', ['-', 'n', 2]]],
//         1]],
//     ['fib', 8]]
// )//?
