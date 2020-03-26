module.exports = str => str.split(/(?:\r\n|\n|\r)/).reduce((s, l) => s + l.replace(/^\s+/gm, ''), '').trim()
