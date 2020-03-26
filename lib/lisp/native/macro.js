module.exports = fn => {
  function macro (...args) {
    return fn.apply(this, args)
  }

  macro.__macro__ = true

  return macro
}
