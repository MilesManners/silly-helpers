const { req } = require('./restrictions')

const logic = {
  // Logical
  'not': req(1, ([arg]) => !arg),
  'and': req(2, args => args.slice(1).every((x, i) => x && args[i])),
  'or': req(2, args => args.slice(1).some((x, i) => x || args[i]))
}

module.exports = logic
