const evaluate = require('../evaluate')
const macro = require('./macro')
const rawArgs = require('./rawArgs')
const specialForm = require('./specialForm')
const tryEval = require('./tryEval')

const native = {
  // Special Forms
  fn: specialForm(function (defArgs, expr) {
    return rawArgs(function (...callArgs) {
      const childScope = Object.create(this)
      defArgs.forEach((argName, index) => { childScope[argName] = tryEval(callArgs[index], this) })
      return evaluate(expr, childScope)
    })
  }),
  do: specialForm(function (...exprs) {
    return exprs.reduce((_, x) => evaluate(x, this), null)
  }),
  if: specialForm(function (cond, succ, fail) {
    return evaluate(evaluate(cond, this) ? succ : fail, this)
  }),
  def: rawArgs(function (name, val) {
    this[name] = evaluate(val, this)
    return this[name]
  }),
  defn: rawArgs(function (name, args, expr) {
    return native.def.call(this, name, native.fn.call(this, args, expr))
  }),
  defmacro: specialForm(function (name, args, expr) {
    return native.def.call(this, name, macro(native.fn.call(this, args, expr)))
  }),
  '...': specialForm(function (fn, arg) {
    return fn.call(this, ...arg)
  }),
  quote: rawArgs(expr => expr),
  expand: specialForm(function (fn) {
    return evaluate(evaluate(fn, this), this)
  }),
  '.': specialForm(function (source, prop) {
    return (this[source] || source)[evaluate(prop, this)]
  }),

  // Macros
  '->a': macro(expr => expr.reduce((curr, [f, ...args]) => [f, curr].concat(args))),
  '->>': macro(expr => expr.reduce((curr, [f, ...args]) => [f].concat(args, [curr]))),

  // Built-in
  isFinite: isFinite,
  isNaN: isNaN,
  parseFloat: parseFloat,
  parseInt: parseInt,
  typeof: arg => typeof arg,
  instanceof: (arg, type) => arg instanceof type,

  // Output
  print: (...args) => args.reduce((a, b) => a + b, ''),
  out: (...args) => args.length === 1 ? args[0] : args,

  // Other
  call: rawArgs(function (fn, ctx, ...args) {
    return tryEval(fn, this).call(tryEval(ctx, this), ...evaluate(args, this))//?
  })
}

module.exports = native
