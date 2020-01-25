let fromCsv = require('./from-csv.js')
let fs = require('fs')

let codes = fs.readFileSync(`${__dirname}/sicCodes.tsv`, 'utf8')

module.exports = fromCsv(codes).map(item => ({ id: item.name }))
