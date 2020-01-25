let fromCsv = require('./from-csv.js')
let fs = require('fs')

// name, code, prepaid, patient_fee_value, is_patient_fee_percentage
let procedures = fs.readFileSync(`${__dirname}/enhanced-plan.tsv`, 'utf8')

module.exports = {
  name: 'Enhanced',
  effective_date: 'now()',
  pricing: {
    one_person: 20,
    two_people: 35,
    three_people: 45,
    four_people: 55,
    five_people_or_more: 68,
  },
  procedures: {
    data: fromCsv(procedures),
  },
}
