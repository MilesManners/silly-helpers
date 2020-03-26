const evaluate = require('../evaluate')

module.exports = (x, ctx) => typeof x === 'string' && x in ctx ? ctx[x] : evaluate(x, ctx)
