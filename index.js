const fs = require('fs')
const path = require('path')

const fromEntries = require('./lib/array/fromEntries')

const buildModule = lib => (p =>
  fromEntries(fs
    .readdirSync(p)
    .filter(f => f.includes('.js'))
    .map(f => [path.basename(f, '.js'), require(path.join(p, f))]))
)(path.join(__dirname, 'lib', lib))

module.exports = {
  array: buildModule('fp'),
  fp: buildModule('fp'),
  string: buildModule('string')
}//?
