const readline = require('readline')
const chalk = require('chalk')

const styles = require('./styles')
const { input, output, cursorTo, write, box, clear, render } = require('./display')
const { w, h, hl, vl } = require('./resources').config

const rl = readline.createInterface({
  input: input,
  output: output,
  prompt: '│ > ',
  terminal: true
})

const t = 10
const b = h - t - hl
const l = ~~((w - vl) / 2)
const r = w - l - vl

const { status, renders } = require('./resources')
let modules = []
const scrollback = []

const exit = () => {
  status.push(chalk`{red Exiting...}`)
  render()

  cursorTo(0, h - 4)
  process.exit()
}

const focus = fn => {
  fn.focus = true
  return fn
}

const native = {
  reload: () => {
    modules = []
    commands = Object.assign({}, native)
    loadModules()
    status.push(chalk`{green Modules reloaded}`)
  },
  modal: focus(() => {
    const mw = 39
    const mh = 12
    const mx = ~~((w - mw) / 2) - 1
    const my = ~~((h - mh) / 2) - 1

    const index = renders.length

    renders.push(() => {
      box(mx, my, mw, mh, styles.double)
      write(chalk.gray('░'.repeat(mw)), mx + 1, my + mh)
      for (let i = mh; i--;) {
        write(chalk.gray('░'), mx + mw, my + i + 1)
      }

      const str = 'Press any key...'
      write(str, ~~(mx + (mw - str.length) / 2), ~~(my + mh / 2 - 1))

      const mrl = readline.createInterface({
        input: input,
        output: output,
        prompt: '│ > ',
        terminal: true
      })

      mrl.on('keypress', () => {
        mrl.close()
        renders.splice(index, 1)
        rl.resume()
      })
    })

    return chalk`{cyan Opening modal}`
  })
}

let commands = Object.assign({}, native)

const ui = () => {
  box(0, 0, l, t, styles.arc, { tr: '┬', bl: '├', br: '┴' })
  box(l - 1, 0, r, t, styles.arc, { tl: '┬', bl: '┴', br: '┤' })
  box(0, t, l + r - 1, b - 1, styles.arc, { tl: '│', tr: '│', t: ' ' })

  write(chalk` {whiteBright Status} `, 1, 0)
  write(chalk` {whiteBright Modules} `, l, 0)

  status.forEach((x, i) => write(x, 2, i + 1))
  modules.forEach((x, i) => write(x, l + 1, i + 1))
  scrollback.slice(-b + 3).forEach((x, i) => write(x, 2, t + i))
}

const startInput = () => {
  write('> ', 2, t)

  rl.on('line', line => {
    scrollback.push('> ' + line)

    const tokens = line.split(/\s/)
    const op = tokens[0]
    const args = tokens.slice(1)

    if (op in commands) {
      const log = str => {
        if (str) {
          scrollback.push(str)
        }
        render()
      }
      const out = commands[op](log, ...args)

      if (out && out !== '') {
        scrollback.push('' + out)
      }

      if (op.focus) {
        rl.pause()
        render()
      } else {
        render()

        write('> ', 2, t + Math.min(b - 3, scrollback.length))
      }
    } else {
      if (op && op !== '') {
        scrollback.push(chalk`{red Could not find command '{bold ${op}}'}`)
      }

      render()

      write('> ', 2, t + Math.min(b - 3, scrollback.length))
    }
  })

  rl.on('SIGINT', exit)
}

const loadModules = () => {
  const path = require('path')
  const modulesFolder = path.join(__dirname, 'modules')

  require('fs')
    .readdirSync(modulesFolder)
    .forEach(file => {
      modules.push(chalk`{magenta ${path.basename(file, '.js')}}`)
      Object.assign(commands, require(path.join(modulesFolder, file)))
      render()
    })
}

const run = async function () {
  renders.push(clear, ui)
  status.push(chalk`{blue Starting...}`)
  render()

  loadModules()
  status.push(chalk`{green Modules loaded}`)
  render()

  startInput()
}

run().catch(e => {
  console.log(e)
  process.exit()
})
