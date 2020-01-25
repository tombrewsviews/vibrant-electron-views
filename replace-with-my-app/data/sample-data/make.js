require('./safe.js');
let { fake, makeEnsureUnique, makeUniqueNumberOfLength } = require('./fake.js');
let { insert } = require('./run.js');
let addMonths = require('date-fns/addMonths');
let basic_plan = require('./basic-plan.js');
let enhanced_plan = require('./enhanced-plan.js');
let formatDate = require('date-fns/format');
let getCognitoUsers = require('./getCognitoUsers.js');
let random = require('lodash/random');
let range = require('lodash/range');
let round = require('lodash/round');
let sample = require('lodash/sample');
let sampleSize = require('lodash/sampleSize');
let sicCodes = require('./sicCodes.js');
let startOfMonth = require('date-fns/startOfMonth');
let startOfToday = require('date-fns/startOfToday');
let zipcodes = require('zipcodes');

let n = max => 1 + (Math.ceil(Math.random() * 10) % max);

(async function() {
  console.time('sample-data');

  // let USERS = 1000
  // let COMPANIES = Math.max(USERS * 0.0005, 6)

  // let cognitoUsers = await getCognitoUsers([
  //   // admins
  //   {
  //     email: 'developer+broker+superadmin@greyfinch.com',
  //     phone_number: '+15417543010',
  //     password: 'Password2019@',
  //     first_name: 'Broker SuperAdmin',
  //     last_name: 'Developer',
  //     gender: 'Male',
  //     marital_status: 'Married',
  //     date_of_birth: '2000-01-01',
  //     can_be_support: true,
  //   },
  //   {
  //     email: 'developer+provider+superadmin@greyfinch.com',
  //     phone_number: '+15417543020',
  //     password: 'Password2019@',
  //     first_name: 'Provider SuperAdmin',
  //     last_name: 'Developer',
  //     gender: 'Male',
  //     marital_status: 'Married',
  //     date_of_birth: '2000-01-01',
  //   },
  //   {
  //     email: 'developer+membergroup+superadmin@greyfinch.com',
  //     phone_number: '+15417543030',
  //     password: 'Password2019@',
  //     first_name: 'MemberGroup SuperAdmin',
  //     last_name: 'Developer',
  //     gender: 'Female',
  //     marital_status: 'Married',
  //     date_of_birth: '2000-01-01',
  //   },
  //   // users
  //   {
  //     email: 'developer+broker+admin@greyfinch.com',
  //     phone_number: '+15417543011',
  //     password: 'Password2019@',
  //     first_name: 'Broker Admin',
  //     last_name: 'Developer',
  //     gender: 'Male',
  //     marital_status: 'Married',
  //     date_of_birth: '2000-01-01',
  //   },
  //   {
  //     email: 'developer+provider+admin@greyfinch.com',
  //     phone_number: '+15417543021',
  //     password: 'Password2019@',
  //     first_name: 'Provider User',
  //     last_name: 'Developer',
  //     gender: 'Male',
  //     marital_status: 'Married',
  //     date_of_birth: '2000-01-01',
  //   },
  //   {
  //     email: 'developer+membergroup+admin@greyfinch.com',
  //     phone_number: '+15417543031',
  //     password: 'Password2019@',
  //     first_name: 'MemberGroup User',
  //     last_name: 'Developer',
  //     gender: 'Female',
  //     marital_status: 'Married',
  //     date_of_birth: '2000-01-01',
  //   },
  //   // members
  //   {
  //     email: 'developer+member+alone@greyfinch.com',
  //     phone_number: '+15417543040',
  //     password: 'Password2019@',
  //     first_name: 'Alone',
  //     last_name: 'Member',
  //     gender: 'Female',
  //     marital_status: 'Single',
  //     date_of_birth: '2000-01-01',
  //   },
  //   {
  //     email: 'developer+member+dependents@greyfinch.com',
  //     phone_number: '+15417543041',
  //     password: 'Password2019@',
  //     first_name: 'Dependents',
  //     last_name: 'Member',
  //     gender: 'Male',
  //     marital_status: 'Married',
  //     date_of_birth: '2000-01-01',
  //   },
  //   {
  //     email: 'developer+member+onboarding+fixed@greyfinch.com',
  //     phone_number: '+15417543042',
  //     password: 'Password2019@',
  //     first_name: 'Fixed',
  //     last_name: 'Member',
  //     gender: 'Female',
  //     marital_status: 'Married',
  //     date_of_birth: '1982-01-01',
  //   },
  //   {
  //     email: 'developer+member+onboarding+decides@greyfinch.com',
  //     phone_number: '+15417543043',
  //     password: 'Password2019@',
  //     first_name: 'Decides',
  //     last_name: 'Member',
  //     // values are empty on purpose
  //     gender: null,
  //     marital_status: null,
  //     date_of_birth: null,
  //   },
  // ])
  // let memberUsers = cognitoUsers.splice(cognitoUsers.length - 4)

  // // look up addresses that are up to 500 miles away from Little Rock
  // let centre = zipcodes.lookupByName('Little Rock', 'AR')[0].zip
  // let zips = zipcodes
  //   .radius(centre, 500)
  //   .filter(zip => /^\d{5}$/.test(zip))
  //   .map(zip => [zip, zipcodes.distance(zip, centre)])
  //   .sort(([, a], [, b]) => a - b)
  //   .map(([zip]) => zip)
  //   .slice(0, USERS + cognitoUsers.length + (COMPANIES + 3) * 3) // 3 base companies

  // let getAddress = () => {
  //   let zip = zips.pop()
  //   if (!zip) {
  //     throw new Error(
  //       'There are no addresses left. Increase the radius of the zipcodes lookup'
  //     )
  //   }

  //   let base = zipcodes.lookup(zip)

  //   let { street } = fake(1, { street: '{{address.streetAddress}}' })[0]

  //   return {
  //     data: { ...base, street },
  //   }
  // }

  // let getEmail = makeEnsureUnique(
  //   '{{internet.userName}}@staging.greyfinch.health'
  // )
  // let getPhoneNumber = makeEnsureUnique('{{phone.phoneNumber(+1##########)}}')
  // let getSocialSecurityNumber = makeEnsureUnique(
  //   '{{helpers.replaceSymbolWithNumber(###-##-####)}}'
  // )

  // let getNationalProviderId = makeUniqueNumberOfLength(10)
  // let getLicenseNumber = makeUniqueNumberOfLength(4)
  // let getPolicyId = makeUniqueNumberOfLength(8)
  // let getFederalTaxIdNumer = makeUniqueNumberOfLength(9)

  // // TODO use excel from Josh
  // // let tags = await insert(
  // //   'tags',
  // //     [{
  // //     name: 'tag1',
  // //     }],
  // //   { returning: 'name' }
  // // )

  // let plans = await insert('plans', [basic_plan, enhanced_plan], {
  //   returning: 'id, pricing',
  // })

  // TODO talk to Vik about this
  // let appointment_templates = await insert(
  //   'appointment_templates',
  //   [
  //     { name: 'core specific, practices define them and they're linked to
  //     types in core' },
  //     { name: '....medical stuff' },
  //   ],
  //   { returning: 'name' }
  // )

  // let appointment_statuses = await insert(
  //   'appointment_statuses',
  //   [
  //     // this would be a UI treatment
  //     // { name: 'NotAvailable' },
  //     { name: 'Scheduled' },
  //     { name: 'Unscheduled' },
  //     { name: 'NoShow' },
  //     { name: 'Cancelled' },
  //     { name: 'Completed' },
  //   ],
  //   { returning: 'name' }
  // );

  // let [male, female] = await insert(
  //   'genders',
  //   [{ name: 'Male' }, { name: 'Female' }, { name: 'PreferNotToDefine' }],
  //   { returning: 'name' }
  // )
  // let genders = [male, female]

  // let marital_statuses = await insert(
  //   'marital_statuses',
  //   [
  //     { name: 'Single' },
  //     { name: 'Married' },
  //     { name: 'Separated' },
  //     { name: 'Divorced' },
  //     { name: 'Widowed' },
  //   ],
  //   { returning: 'name' }
  // )

  // let users = await insert(
  //   'users',
  //   [
  //     ...cognitoUsers.map(item => ({
  //       email: item.email,
  //       has_accepted_terms: true,
  //       phone_number: item.phone_number,
  //       id: item.cognito_id,
  //       cognito_id: item.cognito_id,
  //       can_be_support: item.can_be_support || false,
  //       profile: {
  //         data: {
  //           first_name: item.first_name,
  //           last_name: item.last_name,
  //           date_of_birth: item.date_of_birth,
  //           gender: item.gender,
  //           marital_status: item.marital_status,
  //           social_security_number: getSocialSecurityNumber,
  //           address: getAddress,
  //         },
  //       },
  //     })),
  //     ...fake(USERS, {
  //       email: getEmail,
  //       has_accepted_terms: true,
  //       phone_number: getPhoneNumber,
  //       profile: () => ({
  //         data: fake(1, {
  //           first_name: '{{name.firstName}}',
  //           last_name: '{{name.lastName}}',
  //           date_of_birth: '{{date.past(18)}}',
  //           gender: i => genders[i % genders.length].name,
  //           marital_status: i =>
  //             marital_statuses[i % marital_statuses.length].name,
  //           social_security_number: getSocialSecurityNumber,
  //           address: getAddress,
  //         })[0],
  //       }),
  //     }),
  //     ...memberUsers.map((item, i) => ({
  //       email: item.email,
  //       has_accepted_terms: true,
  //       phone_number: item.phone_number,
  //       id: item.cognito_id,
  //       cognito_id: item.cognito_id,
  //       profile: {
  //         data: {
  //           first_name: item.first_name,
  //           last_name: item.last_name,
  //           date_of_birth: item.date_of_birth,
  //           gender: item.gender,
  //           marital_status: item.marital_status,
  //           social_security_number: getSocialSecurityNumber(),
  //           address: i === memberUsers.length - 1 ? null : getAddress(),
  //         },
  //       },
  //     })),
  //   ],
  //   { returning: 'id, cognito_id, profile_id' }
  // )

  // let NEXT_USER_INDEX = 0

  // let company_agreement_types = await insert(
  //   'company_agreement_types',
  //   [{ name: 'Broker' }, { name: 'Provider' }, { name: 'MemberGroup' }],
  //   { returning: 'name' }
  // )

  // let today = startOfToday()
  // let first_effective_date_raw = startOfMonth(today)
  // let effective_dates = [
  //   first_effective_date_raw,
  //   addMonths(first_effective_date_raw, 1),
  //   addMonths(first_effective_date_raw, 2),
  // ].map(item => formatDate(item, 'yyyy-MM-dd'))
  // let [first_effective_date] = effective_dates

  // let company_data = {
  //   financial_email: getEmail,
  //   hr_email: getEmail,
  //   phone_number: getPhoneNumber,
  //   business_type: 'C Corporation',
  //   federal_tax_id_number: getFederalTaxIdNumer,
  //   primary_industry_sic_code: sample(sicCodes).id,
  //   created_by_user_id: i => users[i + 1].id,
  //   // to make things easier, let the companies' effective date always a date in
  //   // the past
  //   effective_date: effective_dates[0],
  //   company_agreements: i => ({
  //     data: [
  //       isMemberGroup(i) && {
  //         type: 'MemberGroup',
  //         has_accepted_agreement: true,
  //         accepted_agreement_by_user_id: users[i + 1].id,
  //         accepted_agreement_on: 'now()',
  //       },
  //       isProvider(i) && {
  //         type: 'Provider',
  //         has_accepted_agreement: true,
  //         accepted_agreement_by_user_id: users[i + 1].id,
  //         accepted_agreement_on: 'now()',
  //       },
  //     ].filter(Boolean),
  //   }),
  //   physical_address: getAddress,
  //   member_group_contributions: {
  //     data: plans.map(item => {
  //       // even though this should be coming back as an object, in sample data
  //       // it seems to be a string, so...
  //       let pricing =
  //         typeof item.pricing === 'string'
  //           ? JSON.parse(item.pricing)
  //           : item.pricing

  //       return {
  //         plan_id: item.id,
  //         contribution: {
  //           one_person: pricing.one_person,
  //           two_people: round(pricing.two_people * 0.8, 2),
  //           three_people: round(pricing.three_people * 0.7, 2),
  //           four_people: round(pricing.four_people * 0.5),
  //           five_people_or_more: round(pricing.five_people_or_more * 0.5),
  //         },
  //       }
  //     }),
  //   },
  // }

  // let broker_company_admin_id = users[0].id
  // let broker_company_user_id = users[3].id

  // let broker_company = await insert(
  //   'companies',
  //   fake(1, {
  //     ...company_data,
  //     legal_name: 'Broker Company',
  //     company_users: () => ({
  //       data: [
  //         {
  //           user_id: broker_company_admin_id,
  //           role: 'company-admin',
  //         },
  //         {
  //           user_id: broker_company_user_id,
  //           role: 'company-user',
  //         },
  //       ],
  //     }),
  //     company_doing_business_as: i => ({
  //       data: fake(n(3), {
  //         name: '{{company.companyName}}',
  //       }),
  //     }),
  //     company_agreements: {
  //       data: [
  //         {
  //           type: 'Broker',
  //           has_accepted_agreement: true,
  //           accepted_agreement_by_user_id: broker_company_admin_id,
  //           accepted_agreement_on: 'now()',
  //         },
  //       ],
  //     },
  //   })
  // )

  // let broker_id = broker_company[0].id
  // let provider_admin_id = users[1].id
  // let provider_user_id = users[4].id

  // let member_group_admin_id = users[2].id
  // let member_group_user_id = users[5].id

  // // login specific companies
  // let loginCompanies = await insert(
  //   'companies',
  //   fake(2, {
  //     ...company_data,
  //     legal_name: i => (i === 0 ? 'Provider Company' : 'Member Group Company'),
  //     national_provider_id: i => (i === 0 ? getNationalProviderId() : null),
  //     primary_industry_sic_code: i =>
  //       i === 0
  //         ? '8021 - Offices and clinics of dentists'
  //         : sample(sicCodes).id,
  //     broker_id: i => (i === 0 ? null : broker_id),
  //     company_doing_business_as: i => ({
  //       data: fake(n(3), {
  //         name: '{{company.companyName}}',
  //       }),
  //     }),
  //     company_agreements: i => ({
  //       data: [
  //         {
  //           type: i === 0 ? 'Provider' : 'MemberGroup',
  //           has_accepted_agreement: true,
  //           accepted_agreement_by_user_id:
  //             i === 0 ? provider_admin_id : member_group_admin_id,
  //           accepted_agreement_on: 'now()',
  //         },
  //       ],
  //     }),
  //     company_users: i => ({
  //       data: [
  //         {
  //           user_id: i === 0 ? provider_admin_id : member_group_admin_id,
  //           role: 'company-admin',
  //         },
  //         {
  //           user_id: i === 0 ? provider_user_id : member_group_user_id,
  //           role: 'company-user',
  //         },
  //       ],
  //     }),
  //   }),
  //   {
  //     returning: 'id, company_doing_business_as { id, name }',
  //   }
  // )

  // NEXT_USER_INDEX = cognitoUsers.length

  // // generic dummy companies
  // let isProvider = i => i < COMPANIES * 0.5
  // let isMemberGroup = i => i > COMPANIES * 0.3
  // let companies = await insert(
  //   'companies',
  //   fake(COMPANIES, {
  //     ...company_data,
  //     legal_name: '{{company.companyName}}',
  //     broker_id: i => (isMemberGroup(i) ? broker_id : null),
  //     primary_industry_sic_code: i =>
  //       isProvider(i)
  //         ? '8021 - Offices and clinics of dentists'
  //         : sample(sicCodes).id,
  //     national_provider_id: i =>
  //       isProvider(i) ? getNationalProviderId() : null,
  //     company_doing_business_as: i => ({
  //       data: fake(n(3), {
  //         name: '{{company.companyName}}',
  //       }),
  //     }),
  //     company_users: () => ({
  //       data: fake(2, {
  //         user_id: () => users[++NEXT_USER_INDEX].id,
  //         role: 'company-admin',
  //       }),
  //     }),
  //   }),
  //   {
  //     returning: 'id, company_doing_business_as { id, name }',
  //   }
  // )

  // let providers = [loginCompanies[0], ...companies.slice(0, COMPANIES * 0.5)]
  // let member_groups = [
  //   loginCompanies[1],
  //   ...companies.slice(COMPANIES * 0.25, companies.length),
  // ]
  // companies = [...loginCompanies, ...companies]

  // let licenses = await insert('licenses', [
  //   { name: 'General Dentist', is_primary_care: true },
  //   {
  //     name: 'Pediatric Dentist',
  //     default_age_max: 14,
  //     can_age_be_set_by_professional: false,
  //     is_primary_care: true,
  //   },
  //   { name: 'Orthodontist' },
  //   { name: 'Endodontist' },
  //   { name: 'Oral Surgeon' },
  //   { name: 'Periodontist' },
  //   { name: 'Prosthodontist' },
  // ])

  // let amountOfProviderLocations = providers.reduce(
  //   (c, l) => c + l.company_doing_business_as.length,
  //   providers.length
  // )
  // let addresses_for_providers = await insert(
  //   'addresses',
  //   range(amountOfProviderLocations).map(() => getAddress().data)
  // )

  // let provider_locations = await insert(
  //   'provider_locations',
  //   fake(addresses_for_providers.length, {
  //     company_id: i => providers[i % providers.length].id,
  //     address_id: i => addresses_for_providers[i].id,
  //     company_doing_business_as_id: i => {
  //       let company = providers[i % providers.length]
  //       return sample(company.company_doing_business_as).id
  //     },
  //     website: '{{internet.url}}',
  //     phone_number: getPhoneNumber,
  //   }),
  //   { returning: 'id, address_id, company_id' }
  // )

  // let professional_licenses_to_use = licenses.slice(0, 2)
  // let professionals = await insert(
  //   'professionals',
  //   fake(provider_locations.length * 2, {
  //     user_id: i => users[NEXT_USER_INDEX++].id,
  //     // national_provider_id: getNationalProviderId,
  //     license_id: () => sample(professional_licenses_to_use).id,
  //     license_number: getLicenseNumber,
  //   })
  // )

  // let professional_locations_matches = new Set()
  // let professional_locations = await insert(
  //   'professional_locations',
  //   fake(professionals.length * 1.25, {
  //     professional_id: i => professionals[i % professionals.length].id,
  //     provider_location_id: i => {
  //       let professional = professionals[i % professionals.length]

  //       let provider_location_index = i % provider_locations.length
  //       let provider_location =
  //         provider_locations[i % provider_locations.length]

  //       while (
  //         professional_locations_matches.has(
  //           `${professional.id}/${provider_location.id}`
  //         )
  //       ) {
  //         provider_location =
  //           provider_locations[
  //             ++provider_location_index % provider_locations.length
  //           ]
  //       }

  //       professional_locations_matches.add(
  //         `${professional.id}/${provider_location.id}`
  //       )
  //       return provider_location.id
  //     },
  //   }).filter(item => item.provider_location_id),
  //   { returning: 'professional_id, provider_location_id' }
  // )

  // await insert(
  //   'statuses',
  //   [
  //     { name: 'Created' },
  //     { name: 'Invited' },
  //     { name: 'Enrolled' },
  //     { name: 'Declined' },
  //     { name: 'Active' },
  //     { name: 'Inactive' },
  //   ],
  //   { returning: 'name' }
  // )

  // let relationships = await insert(
  //   'relationships',
  //   [{ name: 'Spouse' }, { name: 'Child' }, { name: 'Other' }],
  //   { returning: 'name' }
  // )

  // // TODO revisit this, for now I'm skipping users that were used already and
  // // only adding new users as members
  // // we may want to attach the right users to the right companies later on
  // users = users.slice(NEXT_USER_INDEX)

  // let [
  //   memberUserAlone,
  //   memberUserDependents,
  //   memberFixedUser,
  //   memberDecidesUser,
  // ] = memberUsers

  // function has_accepted_agreement(i) {
  //   let { cognito_id } = users[i]
  //   if (
  //     cognito_id === memberUserAlone.cognito_id ||
  //     cognito_id === memberUserDependents.cognito_id
  //   ) {
  //     return true
  //   } else if (
  //     cognito_id === memberFixedUser.cognito_id ||
  //     cognito_id === memberDecidesUser.cognito_id
  //   ) {
  //     return false
  //   } else {
  //     return users_effective_dates[i] === first_effective_date
  //   }
  // }

  // let memberProfessionalAndLocation = {}
  // function getMemberProfessionalAndLocation(i) {
  //   if (memberProfessionalAndLocation[i]) {
  //     return memberProfessionalAndLocation[i]
  //   }

  //   let { cognito_id } = users[i]

  //   let professional_id = null
  //   if (
  //     cognito_id === memberUserAlone.cognito_id ||
  //     cognito_id === memberUserDependents.cognito_id
  //   ) {
  //     professional_id = sample(professionals).id
  //   } else if (
  //     cognito_id === memberFixedUser.cognito_id ||
  //     cognito_id === memberDecidesUser.cognito_id
  //   ) {
  //     professional_id = null
  //   } else {
  //     professional_id = i % 10 ? sample(professionals).id : null
  //   }

  //   let locations = professional_id
  //     ? professional_locations.filter(
  //         item => item.professional_id === professional_id
  //       )
  //     : professional_locations
  //   let provider_location_id = sample(locations).provider_location_id

  //   memberProfessionalAndLocation[i] = {
  //     professional_id,
  //     provider_location_id,
  //   }

  //   return memberProfessionalAndLocation[i]
  // }

  // let users_effective_dates = users.map(item => {
  //   if (
  //     item.cognito_id === memberUserAlone.cognito_id ||
  //     item.cognito_id === memberUserDependents.cognito_id ||
  //     item.cognito_id === memberFixedUser.cognito_id ||
  //     item.cognito_id === memberDecidesUser.cognito_id
  //   ) {
  //     return first_effective_date
  //   }

  //   return sample(effective_dates)
  // })

  // let members = await insert(
  //   'members',
  //   fake(users.length, {
  //     user_id: i => users[i].id,
  //     profile_id: i => users[i].profile_id,
  //     company_id: i => member_groups[i % member_groups.length].id,
  //     // 9 out of 10 members will have a professional chosen
  //     professional_id: i => getMemberProfessionalAndLocation(i).professional_id,
  //     provider_location_id: i =>
  //       getMemberProfessionalAndLocation(i).provider_location_id,
  //     plan_id: i =>
  //       users[i].cognito_id !== memberDecidesUser.cognito_id
  //         ? plans[i % plans.length].id
  //         : null,
  //     effective_date: i => users_effective_dates[i],
  //     policy_id: getPolicyId,
  //     status: i =>
  //       users[i].cognito_id === memberDecidesUser.cognito_id
  //         ? 'Invited'
  //         : users_effective_dates[i] === first_effective_date
  //         ? 'Active'
  //         : 'Enrolled',
  //     has_accepted_agreement,
  //     created_by_user_id: i => users[i].id,
  //     accepted_agreement_by_user_id: i =>
  //       has_accepted_agreement(i) ? users[i].id : null,
  //     accepted_agreement_on: i => (has_accepted_agreement(i) ? 'now()' : null),
  //     is_configuration_up_to_member: i =>
  //       users[i].cognito_id === memberDecidesUser.cognito_id,
  //   }),
  //   {
  //     returning:
  //       'id, plan_id, status, has_accepted_agreement, accepted_agreement_by_user_id, is_configuration_up_to_member, accepted_agreement_on, created_by_user_id, effective_date, profile { last_name }, user_id',
  //   }
  // )

  // // reset
  // let memberProfessionalAndLocationForDependent = {}
  // function getMemberProfessionalAndLocationForDependent(i) {
  //   if (memberProfessionalAndLocationForDependent[i]) {
  //     return memberProfessionalAndLocationForDependent[i]
  //   }

  //   let professional_id = i % 10 ? sample(professionals).id : null

  //   let provider_location_id = null
  //   if (professional_id) {
  //     let locations = professional_locations.filter(
  //       item => item.professional_id === professional_id
  //     )
  //     provider_location_id = sample(locations).provider_location_id
  //   }

  //   memberProfessionalAndLocationForDependent[i] = {
  //     professional_id,
  //     provider_location_id,
  //   }

  //   return memberProfessionalAndLocationForDependent[i]
  // }

  // function getMemberDependentsRange(member) {
  //   switch (member.user_id) {
  //     case memberUserAlone.cognito_id:
  //       return 0

  //     case memberUserDependents.cognito_id:
  //       return 3

  //     default:
  //       return random(0, 5)
  //   }
  // }

  // let members_with_dependents = sampleSize(members, members.length * 0.7)
  //   .filter(m => !m.is_configuration_up_to_member)
  //   .map(m =>
  //     sampleSize([m, m, m, m, m, m], getMemberDependentsRange(m)).map(
  //       (member, index) => ({
  //         member,
  //         index,
  //       })
  //     )
  //   )
  //   .flat()
  // await insert(
  //   'members',
  //   fake(members_with_dependents.length, {
  //     policy_id: getPolicyId,
  //     plan_id: i => members_with_dependents[i].member.plan_id,
  //     status: i => members_with_dependents[i].member.status,
  //     has_accepted_agreement: i =>
  //       members_with_dependents[i].member.has_accepted_agreement,
  //     accepted_agreement_by_user_id: i =>
  //       members_with_dependents[i].member.accepted_agreement_by_user_id,
  //     accepted_agreement_on: i =>
  //       members_with_dependents[i].member.accepted_agreement_on,
  //     created_by_user_id: i =>
  //       members_with_dependents[i].member.created_by_user_id,
  //     effective_date: i => members_with_dependents[i].member.effective_date,
  //     is_configuration_up_to_member: false,
  //     main_member_id: i => members_with_dependents[i].member.id,
  //     relationship_to_main_member: i =>
  //       members_with_dependents[i].index === 0 ? 'Spouse' : 'Child',
  //     professional_id: i =>
  //       getMemberProfessionalAndLocationForDependent(i).professional_id,
  //     provider_location_id: i =>
  //       getMemberProfessionalAndLocationForDependent(i).provider_location_id,
  //     profile: i => ({
  //       data: fake(1, {
  //         first_name: '{{name.firstName}}',
  //         last_name: members_with_dependents[i].member.profile.last_name,
  //         date_of_birth: '{{date.past(18)}}',
  //         gender: sample(genders).name,
  //         social_security_number: getSocialSecurityNumber,
  //       })[0],
  //     }),
  //   })
  // )

  console.timeEnd('sample-data');
})();
