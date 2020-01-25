let fromCsv = require('./from-csv.js')
let fs = require('fs')

// name, code, prepaid, patient_fee_value, is_patient_fee_percentage
let procedures = fs.readFileSync(`${__dirname}/basic-plan.tsv`, 'utf8')

module.exports = {
  name: 'Basic',
  effective_date: 'now()',
  pricing: {
    one_person: 12,
    two_people: 22,
    three_people: 30,
    four_people: 38,
    five_people_or_more: 48,
  },
  procedures: {
    data: fromCsv(procedures),
  },
}
