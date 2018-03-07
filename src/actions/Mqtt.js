const TYPES = require('./types')
const { publish } = require('../services/mqtt')

const setMqttServer = ( server ) => {
  return {
    type: TYPES.SET_MQTTSERVER,
    server: server,
  }
}

const setMqttClient = ( client ) => {
  return {
    type: TYPES.SET_MQTTCLIENT,
    client: client,
  }
}

const mqttPublish = ( payload ) => {
  publish( payload )
}

module.exports = {
  setMqttServer: setMqttServer,
  setMqttClient: setMqttClient,
  mqttPublish: mqttPublish,
}
