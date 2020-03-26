const { req } = require('./restrictions')

const math = {
  // Arithmetic
  '+': req(1, args => args.length === 1
    ? Math.abs(args[0])
    : args.reduce((a, b) => a + b)),
  '-': req(1, ([arg, ...args]) => args.length === 0
    ? -arg
    : args.reduce((a, b) => a - b, arg)),
  '*': (arg, ...args) => args.reduce((a, b) => a * b, arg),
  '/': (arg, ...args) => args.reduce((a, b) => a / b, arg),
  '^': (arg, ...args) => args.reduce((a, b) => a ** b, arg),

  // Comparison
  '=': req(2, args => !args.slice(1).some(x => x !== args[0])),
  '!=': req(2, args => args.slice(1).some(x => x !== args[0])),
  '<': req(2, args => !args.slice(1).some((x, i) => args[i] >= x)),
  '<=': req(2, args => !args.slice(1).some((x, i) => args[i] > x)),
  '>': req(2, args => !args.slice(1).some((x, i) => args[i] <= x)),
  '>=': req(2, args => !args.slice(1).some((x, i) => args[i] < x))
}

module.exports = math
