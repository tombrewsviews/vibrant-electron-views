let faker = require('faker')
let padStart = require('lodash/padStart')
let random = require('lodash/random')
let range = require('lodash/range')

module.exports.fake = function fake(times, shape) {
  let res = []

  for (let i = 0; i < Math.ceil(times); i++) {
    let obj = {}

    Object.entries(shape).forEach(([key, value]) => {
      obj[key] = value

      if (typeof value === 'function') {
        obj[key] = value(i)
        value = obj[key]
      }

      if (typeof obj[key] !== 'string') return

      if (/{{/.test(value)) {
        obj[key] = faker.fake(value)
      }

      if (value.startsWith('{{date.')) {
        obj[key] = new Date(obj[key]).toISOString()
      }
    })

    res.push(obj)
  }

  return res
}

module.exports.makeEnsureUnique = function makeEnsureUnique(value) {
  let used = new Set()

  return () => {
    let next = faker.fake(value)

    while (used.has(next)) {
      next = faker.fake(value)
    }

    used.add(next)
    return next
  }
}

module.exports.makeUniqueNumberOfLength = function makeUniqueNumberOfLength(n) {
  let set = new Set()
  let max = parseInt(
    range(n)
      .map(() => 9)
      .join('')
  )

  return function getNext() {
    let value = null

    do {
      value = padStart(random(0, max), n, '0')
    } while (set.has(value))

    return value
  }
}
