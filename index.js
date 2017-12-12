const Meter = require('./src/meter')
let env_path = '.env'

if ( process.env.NODE_ENV === 'development' ) {
  env_path = '.env.development'
}

require('dotenv').config({ path: env_path })

const config = {
  id: '01',
  xbeeProductId: '6001',
  mqtt: {
    server: process.env.SERVER || 'mqtt://192.168.0.2',
    port: process.env.PORT || '1883',
    client: process.env.CLIENT || 'rasp1'
  }
}

const meter = new Meter( config )

meter.start()
