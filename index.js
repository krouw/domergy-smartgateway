const Meter = require('./src/meter')

const config = {
  id: '01',
  xbeeProductId: '6001',
  mqtt: 'mqtt://localhost:1883'
}

const meter = new Meter( config.id ,config.xbeeProductId, config.mqtt )

meter.start()
