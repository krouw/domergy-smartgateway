const TYPES = require('./types')
const mqttService = require('../services/mqtt')

const setMqttServer = ( server ) => {
  return {
    type: TYPES.SET_MQTTSERVER,
    server: server,
  }
}

const mqttPublish = ( service, payload ) => {
  mqttService(service, payload)
}

module.exports = {
  setMqttServer: setMqttServer,
  mqttPublish: mqttPublish,
}
