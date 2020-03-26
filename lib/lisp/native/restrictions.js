module.exports = {
  req: (n, fn) => (...args) => args.length < n ? undefined : fn(args),
  only: (n, fn) => (...args) => args.length !== n ? undefined : fn(args)
}
