const SmartGateway = require('./src/SmartGateway')
let env_path = '.env'

if ( process.env.NODE_ENV === 'development' ) {
  env_path = '.env.development'
}

require('dotenv').config({ path: env_path })

const config = {
  id: process.env.ID,
  xbeeProductId: process.env.ID_XBEE,
  mqtt: {
    host: process.env.MQTT_SERVER,
    port: process.env.MQTT_PORT,
    client: process.env.MQTT_CLIENT,
    password: process.env.MQTT_PASSWORD,
  },
  interval: 10000,
}

const sg = new SmartGateway( config )

sg.start()
