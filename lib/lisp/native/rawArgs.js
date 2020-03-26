module.exports = f => {
  f.__specialForm__ = true
  f.__rawArgs__ = true
  return f
}
