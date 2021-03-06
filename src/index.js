const debug = require('./debug')('run')
const fs = require('fs-extra')
const vm = require('vm')
const indentationParser = require('./indentation')
let commands = {}
let environmentSet = false

const REPLACEMENT_REGEX= /%[\w\d-_]+%/g;

const makeLine = (line, lineNum) => {
  const [cmd, ...args] = line.trim().split(/\s+/)
  let singleArg = args.join(' ')
  if (!commands[cmd]) {
    throw new Error(`command ${cmd} is not supported`)
  }
  if (cmd !== 'extract') {
    // unescape the strings
    singleArg = JSON.parse(`"${singleArg}"`)
  }
  return commands[cmd](singleArg)
}

const makeBlock = (lines, { map }={}) => {
  const realLines = lines.filter(line => typeof line !== 'string' || !line.match(/^\s*#/))
  const fns = realLines.map(line => typeof line === 'string' ? makeLine(line) : makeBlock(line, { map: true }))
  if (map) {
    return commands.map(commands.pipe(...fns))
  } else {
    return commands.pipe(...fns)
  }
}

/**
 * Sets environment variables for scripts
 * @param {Object} [env={}] key value pairs to set into `process.env`
 */
const setKmdEnv = (env = {}) => {
  if (Object(env) !== env) throw new Error('env param must be an object')

  for (let v in env) {
    process.env[v] = env[v]
  }

  environmentSet = true
  commands = require('./commands/index')
}

const compile = (scriptSrc, variables = {}) => {
  // if setKmdEnv wasn't called, load up the commands, should only be called once
  if (!environmentSet) setKmdEnv({})
  // console.time('compile')

  const source = scriptSrc
  .trim()
  .replace(REPLACEMENT_REGEX, match => {
    const key = match.substring(1, match.length-1);
    return variables.hasOwnProperty(key) ? variables[key] : match
  })
  .split('\n')
  .filter(line => line.trim().length > 0);

  const lines = indentationParser(source)
  const pipeline = makeBlock(lines)
  // console.timeEnd('compile')
  return pipeline
}

const run = async (fn, input) => {
  // console.time('run')
  const result = await fn(input)
  // console.timeEnd('run')
  return result
}

const runScript = (scriptSrc, variables = {}) => run(compile(scriptSrc, variables))

module.exports = {
  compile,
  run,
  setKmdEnv,
  runScript,
  commands
}
