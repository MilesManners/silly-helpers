const chalk = require('chalk')
const { status, config } = require('../resources')
const { cursorTo } = require('../display')

module.exports = {
  exit: log => {
    status.push(chalk`{red Exiting...}`)
    log()

    cursorTo(0, config.h - 4)
    process.exit()
  }
}
