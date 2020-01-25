let { promises: fs } = require('fs')
let delve = require('dlv')
let fetch = require('fetchu')
let path = require('path')
let YAML = require('yaml')

let flattenPermissionColumns = item => {
  if (item.permission && Array.isArray(item.permission.columns)) {
    item.permission.columns = item.permission.columns.flat(Infinity)
  }
  return item
}

function fillGapsTables(item) {
  let res = {
    array_relationships: [],
    configuration: {
      custom_column_names: {},
      custom_root_fields: {
        delete: null,
        insert: null,
        select: null,
        select_aggregate: null,
        select_by_pk: null,
        update: null,
      },
    },
    computed_fields: [],
    delete_permissions: [],
    event_triggers: [],
    insert_permissions: [],
    is_enum: false,
    object_relationships: [],
    select_permissions: [],
    update_permissions: [],
    ...item,
  }

  res.select_permissions = res.select_permissions
    .map(item => ({
      // comment: null,
      ...item,
      permission: {
        allow_aggregations: true,
        filter: {},
        columns: [],
        computed_fields: [],
        ...item.permission,
      },
    }))
    .map(flattenPermissionColumns)
  res.delete_permissions = res.delete_permissions
    .map(item => ({
      // comment: null,
      ...item,
      permission: {
        filter: {},
        ...item.permission,
      },
    }))
    .map(flattenPermissionColumns)
  res.insert_permissions = res.insert_permissions
    .map(item => ({
      // comment: null,
      ...item,
      permission: {
        check: {},
        set: {},
        columns: [],
        ...item.permission,
      },
    }))
    .map(flattenPermissionColumns)
  res.update_permissions = res.update_permissions
    .map(item => ({
      // comment: null,
      ...item,
      permission: {
        filter: {},
        set: {},
        columns: [],
        ...item.permission,
      },
    }))
    .map(flattenPermissionColumns)

  return res
}

let FILL_GAPS = {
  functions: item => item,
  remote_schemas: item => item,
  tables: fillGapsTables,
}

async function getConfig(type) {
  try {
    let root = path.join(__dirname, 'metadata', type)
    let files = await fs.readdir(root)

    return await Promise.all(
      files
        .filter(f => f.endsWith('.yaml'))
        .map(async f =>
          FILL_GAPS[type](
            YAML.parse(await fs.readFile(path.join(root, f), 'utf8'))
          )
        )
    )
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.error(type, error)
    }

    return []
  }
}

let METADATA_API = `${process.env.HASURA_GRAPHQL_ENDPOINT}/v1/query`

async function query(type, args = {}) {
  if (process.env.DEBUG) {
    console.log(JSON.stringify(args, null, '  '))
  }

  return await fetch(METADATA_API, {
    method: 'POST',
    body: JSON.stringify({ type, args }),
    headers: {
      'content-type': 'application/json',
      'x-hasura-admin-secret': process.env.HASURA_GRAPHQL_ADMIN_SECRET,
    },
  }).then(r => r.json())
}

async function rollback(backup) {
  console.log('> rollback')
  try {
    await query('replace_metadata', backup)
    console.log('  (done)')
  } catch (error) {
    console.error(' (fail)')
    console.error(error)
  }
}

async function clear() {
  console.log('> clear metadata')
  console.log(await query('clear_metadata'))
  console.log('  (done)')
}

let ONLY_TRACK_TABLES_KEYS_TO_SKIP = [
  'array_relationships',
  'event_triggers',
  'delete_permissions',
  'insert_permissions',
  'select_permissions',
  'update_permissions',
  'object_relationships',
]

async function setup({ dryRun = false, onlyTrackTables = false }) {
  let backup = await query('export_metadata')
  let next = null

  try {
    await clear()

    console.log('> replace metadata')
    next = {
      version: 2,
      tables: await getConfig('tables'),
    }

    if (onlyTrackTables) {
      console.log(
        '>> only tracking tables, skipping permissions, triggers, etc.'
      )
      next.tables.forEach(table => {
        ONLY_TRACK_TABLES_KEYS_TO_SKIP.forEach(key => {
          table[key] = []
        })
      })
    } else {
      next.functions = await getConfig('functions')
      next.remote_schemas = await getConfig('remote_schemas')
    }

    if (process.env.DEBUG) {
      await fs.writeFile(
        'metadata-debug.json',
        JSON.stringify(next, null, '  ')
      )

      if (dryRun) {
        process.exit(0)
      }
    }

    console.log(await query('replace_metadata', next))
    console.log('  (done)')
  } catch (error) {
    console.error('! something went wrong')

    // Error: {"path":"$.args.tables[14].select_permissions[0].permission.filter","error":"\"subscriber_dependent\" does not exist","code":"not-exists"}
    if (next && /{/.test(error.message)) {
      let parsedError = JSON.parse(error.message)

      if (parsedError.path) {
        try {
        let [, type, index, innerPath] = parsedError.path.match(
          /(tables|functions|remote_schemas)\[(\d+)\]\.?(.+)?/
        )

        console.log('type', type, 'index', index)
        let thing = next[type][parseInt(index, 10)]
        let name = thing.name || thing.table
        console.error(`Error ${parsedError.code} on "${name}" "${type}".`)
        console.error(parsedError.error)
        if (innerPath) {
          console.error(`JSON path "${innerPath}"`)
          console.error(
            'Content',
            JSON.stringify(delve(thing, innerPath), null, '  ')
          )
        }
        } catch(error) {
          console.error("Unexpected error", error)
        }
      }

      console.error(error.message)
    } else {
      console.error(error)
    }
    rollback(backup)
  }
}

async function run() {
  if (process.env.DEBUG) {
    console.log('> Metadata API: ', METADATA_API)
  }

  switch (process.argv[2]) {
    case 'setup': {
      await setup({
        dryRun: process.argv.includes('--dryRun'),
        onlyTrackTables: process.argv.includes('--onlyTrackTables'),
      })
      break
    }

    case 'clear': {
      await clear()
      break
    }

    default: {
      console.log(`Usage:\n  node metadata.js setup\n  node metadata.js clear`)
    }
  }
}

run().catch(console.error.bind(console))
