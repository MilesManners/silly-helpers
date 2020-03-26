const chalk = require('chalk')
const { status, state } = require('../resources')

module.exports = {
  start: () => {
    state.status = 'running'
    status.push(chalk`{blue Game started}`)
  },
  status: () => chalk`{blue ${state.status || 'Not started'}}`
}
