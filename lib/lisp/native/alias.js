const native = require('./native')

const alias = {
  eq: native['='],
  ne: native['!='],
  lt: native['<'],
  le: native['<='],
  gt: native['>'],
  ge: native['>='],
  '!': native.not,
  '**': native['^'],
  get: native['.'],
  spread: native['...']
}

module.exports = alias
