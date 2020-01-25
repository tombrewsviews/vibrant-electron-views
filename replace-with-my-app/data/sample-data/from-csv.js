let COLUMNS = [
  'name',
  'code',
  'prepaid',
  'patient_fee_value',
  'is_patient_fee_percentage',
]

module.exports = function fromCsv(text) {
  return text
    .split('\n')
    .map(line => {
      let tline = line.trim()
      if (!tline) return false

      let obj = {}
      tline.split('\t').forEach((rvalue, index) => {
        let value = rvalue
        if (value === 'FALSE') {
          value = false
        } else if (value === 'TRUE') {
          value = true
        } else if (/^\d+$/.test(value)) {
          value = parseInt(value, 10)
        }

        obj[COLUMNS[index]] = value
      })

      if (obj.prepaid > 0) {
        obj.patient_fee_value = 0
      }

      return obj
    })
    .filter(Boolean)
}
