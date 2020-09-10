const readline = require('readline')

const styles = require('./styles')
const { renders } = require('./resources')

const input = process.stdin
const output = process.stdout

const cursorTo = (...args) => readline.cursorTo(output, ...args)
const moveCursor = (...args) => readline.moveCursor(output, ...args)

const write = (str, x, y) => {
  if (x !== undefined || y !== undefined) cursorTo(x, y)
  output.write(str)
}

const box = (x, y, w, h, ...args) => {
  const { tl, tr, bl, br, t, b, l, r, em } = args.length
    ? args.reduce((a, b) => Object.assign(a, b), {})
    : styles.light

  write(`${tl}${t.repeat(w - 2)}${tr}`, x, y)

  for (let i = h - 2; i--;) {
    write(`${l}${em.repeat(w - 2)}${r}`, x, y + h - i - 2)
  }

  write(`${bl}${b.repeat(w - 2)}${br}`, x, y + h - 1)
}

const clear = () => {
  // Clear screen
  write('\u001B[2J\u001B[0;0f')
}

const render = () => {
  renders.forEach(x => x())
}

module.exports = {
  input,
  output,
  cursorTo,
  moveCursor,
  write,
  box,
  clear,
  render
}
