const pipe = require('../fp/pipe')

const evaluate = (rawExpr, sco = {}) => rawExpr instanceof Array
  ? pipe(
    () => typeof rawExpr[0] === 'string' && rawExpr[0] in sco && sco[rawExpr[0]].__rawArgs__
      ? [sco[rawExpr[0]], ...rawExpr.slice(1)]
      : rawExpr.map(sym => typeof sym === 'string' && sym in sco ? sco[sym] : sym),
    ([p, ...args]) => [p instanceof Array ? evaluate(p, sco) : p, args],
    ([p, args]) => p instanceof Function
      ? p.__macro__
        ? evaluate(p(args), sco)
        : p.apply(sco, args.map((arg, i) =>
          arg instanceof Array && !p.__specialForm__
            ? evaluate(arg, sco)
            : arg
        ))
      : [p, ...args.map(arg => arg instanceof Array ? evaluate(arg, sco) : arg)]
  )()
  : rawExpr

module.exports = evaluate
