const evaluate = require('./evaluate')
const native = require('./native')

function transform (src) {
  return src
}

module.exports = {
  interpret: globals =>
    src => evaluate(transform(src), Object.assign(Object.create(native), globals)),

  interactive: globals =>
    (scope =>
      src => evaluate(transform(src), scope)
    )(Object.assign(Object.create(native), globals))
}
