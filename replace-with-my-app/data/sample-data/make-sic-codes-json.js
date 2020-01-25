let codes = require('./sicCodes.js')

require('fs').writeFileSync(`${__dirname}/sicCodes.json`, JSON.stringify(codes, null, '  '), 'utf8')
