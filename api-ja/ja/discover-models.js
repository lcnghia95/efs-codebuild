'use strict'

const loopback = require('loopback')
const promisify = require('util').promisify
const fs = require('fs')
const writeFile = promisify(fs.writeFile)
const readFile = promisify(fs.readFile)
const mkdirp = promisify(require('mkdirp'))
const datasource = {
  "name": "common",
  "connector": "mysql",
  "host": "",
  "database": "common",
  "password": "",
  "user": "",
  "dateStrings": true,
  "legacyUtcDateProcessing": false
}
const schema = datasource.database

async function discover() {
  // Create model definition files
  await mkdirp(datasource.name)
  await writeFile(datasource.name + '/model-config.json', "{}")

  let ds = new loopback.DataSource(datasource),
    tables = await ds.discoverModelDefinitions({
      schema: schema
    })

  for (let i in tables) {
    await discoverModel(ds, schema, tables[i].name)
  }
}

async function discoverModel(ds, schema, name) {
  // Discover models and relations
  let informationSchemas = await ds.discoverSchemas(name),
    options = informationSchemas[`${schema}.${name}`].options

  informationSchemas[`${schema}.${name}`].options = Object.assign({}, options, {
    automaticValidation: false
  })
  informationSchemas[`${schema}.${name}`].mixins = {
    UnixTimestamp: true,
    Crypto: true,
  }

  await writeFile(
    datasource.name + `/${name}.json`,
    JSON.stringify(informationSchemas[`${schema}.${name}`], null, 2)
  )

  // Expose models via REST API
  let configJson = await readFile(datasource.name + '/model-config.json',
    'utf-8')
  console.log('MODEL CONFIG', configJson)
  let config = JSON.parse(configJson)
  config[toCamelCase(name)] = {
    dataSource: schema,
    public: false
  }
  await writeFile(
    datasource.name + '/model-config.json',
    JSON.stringify(config, null, 2)
  )
}

function toCamelCase(str) {
  return str.split('_').map(function capitalize(part) {
    return part.charAt(0).toUpperCase() + part.slice(1)
  }).join('')
}


discover().then(
  () => process.exit(),
  error => {
    console.error('UNHANDLED ERROR:\n', error)
    process.exit(1)
  },
)
