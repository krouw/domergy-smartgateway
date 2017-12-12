const Meter = require('./src/meter')
let env_path = '.env'

if ( process.env.NODE_ENV === 'development' ) {
  env_path = '.env.development'
}

require('dotenv').config({ path: env_path })

const config = {
  id: process.env.ID,
  xbeeProductId: process.env.ID_XBEE,
  mqtt: {
    server: process.env.MQTT_SERVER,
    port: process.env.MQTT_PORT,
    client: process.env.MQTT_CLIENT
  },
  interval: 5000,
}

const meter = new Meter( config )

meter.start()
