let fetch = require('node-fetch')
let { promises: fs, existsSync } = require('fs')
let chunk = require('lodash/chunk')
let path = require('path')
let take = require('lodash/take')

let ENDPOINT =
  process.env.HASURA_GRAPHQL_ENDPOINT ||
  process.argv[2] ||
  `http://localhost:8080`
let HEADERS = {}
const adminSecret = process.env.HASURA_GRAPHQL_ADMIN_SECRET || process.argv[3]
if (adminSecret) {
  HEADERS['x-hasura-admin-secret'] = adminSecret
}

async function execute(query, variables) {
  let res = await fetch(`${ENDPOINT}/v1/graphql`, {
    method: 'POST',
    body: JSON.stringify({ query, variables }),
    headers: HEADERS,
  })

  if (res.status !== 200) {
    console.error(query, variables, await res.text())
    process.exit(1)
  }

  return await res.json()
}
module.exports.execute = execute

module.exports.run = async function run(file, variables = {}) {
  let query = await fs.readFile(path.join(__dirname, file), 'utf8')
  let res = await execute(query, variables)

  if (res.errors) {
    console.error(`💩 ${file}`)
    console.error('\n> query\n', query)
    console.error('\n> variables\n', JSON.stringify(variables))
    console.error('\n> errors\n', JSON.stringify(res.errors, null, '  '))
    process.exit(1)
  }

  console.log(`✅ ${file}\n`)

  return res
}

module.exports.insert = async function insert(
  type,
  objects,
  { returning = 'id' } = {}
) {
  let query = `mutation insert${type}($objects: [${type}_insert_input!]!) {
  list: insert_${type}(objects: $objects) {
    returning { ${returning} }
  }
}`

  let chunks = chunk(objects, 10000)
  let res = await chunks.reduce(async (prevRun, objects) => {
    let prev = await prevRun

    let res = await execute(query, { objects })

    if (res.errors) {
      console.error(`💩 ${type}`)
      console.error('\n> query\n', query)
      console.error('\n> objects\n', JSON.stringify(objects))
      console.error('\n> errors\n', JSON.stringify(res.errors, null, '  '))
      process.exit(1)
    }

    if (chunks.length > 1) {
      process.stdout.write('.')
    }

    return [...prev, ...res.data.list.returning]
  }, Promise.resolve([]))

  console.log(`✅ ${res.length} ${type}`)
  if (res.length > 20) {
    console.log('(showing 20)')
  }
  console.log(
    take(res, 20)
      .map(item => item[returning.split(',')[0]])
      .join(', '),
    '\n'
  )

  return res
}

module.exports.remove = async function remove(types) {
  let removeMutations = types.map(
    type => `delete_${type}(where: {}) { affected_rows }`
  )

  let query = `mutation { ${removeMutations} }`
  let res = await execute(query)

  if (res.errors) {
    console.error(`💩 ${types.join(', ')}`)
    console.error('\n> query\n', query)
    console.error('\n> errors\n', JSON.stringify(res.errors, null, '  '))

    let removeSql = types.map(type => `delete from ${type};`).join('\n')
    console.error(
      `\nIt might be a timeout. You may want to try this on the Data/SQL tab instead:\n${removeSql}`
    )
    process.exit(1)
  }

  Object.entries(res.data).forEach(([key, value]) => {
    console.log(`🗑  ${value.affected_rows} ${key}`)
  })

  return res.data
}
