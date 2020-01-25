require('./safe.js')
let { remove } = require('./run.js')

;(async function() {
  console.time('remove-sample-data')

  // await remove([
  //   'member_group_contributions',
  //   'members',

  //   'procedure_tags',
  //   'procedures',
  //   'tags',
  //   'plans',

  //   'professional_locations',
  //   'professionals',
  //   'licenses',

  //   'provider_locations',

  //   'company_doing_business_as',
  //   'company_users',
  //   'company_agreements',
  //   'companies',
  //   'users',
  //   'profiles',
  //   'addresses',
  //   'statuses',
  //   'genders',
  //   'marital_statuses',
  //   'relationships',
  //   'company_agreement_types',
  // ])

  console.timeEnd('remove-sample-data')
})()
