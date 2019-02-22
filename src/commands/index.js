const pipe = require('./pipe')
const echo = require('./echo')
const exec = require('./exec')
const save = require('./save')
const contains = require('./contains')
const extract = require('./extract')
const load = require('./load')
const remove = require('./remove')
const split = require('./split')
const lines = require('./lines')
const map = require('./map')
const as = require('./as')
const template = require('./template')
const cat = require('./cat')
const parseDate = require('./parse-date')
const parseInt = require('./parse-int')
const noEmpty = require('./no-empty')
const pathResolve = require('./path-resolve')
const trim = require('./trim')
const debug = require('./debug')
const print = require('./print')
const defaultTo = require('./default-to')

module.exports = {
  pipe,
  echo,
  exec,
  save,
  defaultTo,
  extract,
  load,
  remove,
  split,
  lines,
  map,
  as,
  template,
  cat,
  contains,
  parseDate,
  parseInt,
  pathResolve,
  noEmpty,
  trim,
  debug,
  print
}
