const Meter = require('./src/meter')

const config = {
  xbeeProductId: '6001',
}

const meter = new Meter( config.xbeeProductId )

meter.start()
