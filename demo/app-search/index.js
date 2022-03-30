const fs = require('fs')
const { Client } = require('@elastic/elasticsearch')

const HTTP_CA = fs.readFileSync('./config/http_ca.crt')

const getClient = async () => {
  const client = new Client({
    node: 'https://localhost:9200',
    auth: {
      username: 'elastic',
      password: 'elastic'
    },
    tls: {
      ca: HTTP_CA,
      rejectUnauthorized: false
    }
  })

  // health check
  const info = await client.cat.health()
  console.log('[cluster-health]', info)

  return client
}

const run = async () => {
  const client = await getClient()
}

run().catch(console.error)



