const Meter = require('./src/meter')

const config = {
  id: '01',
  xbeeProductId: '6001',
  mqtt: {
    server: 'mqtt://192.168.0.2:1883',
    client: 'rasp1'
  }
}

const meter = new Meter( config.id ,config.xbeeProductId, config.mqtt )

meter.start()
