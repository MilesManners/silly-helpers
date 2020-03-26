module.exports = f => {
  f.__specialForm__ = true
  return f
}
