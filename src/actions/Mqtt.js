const TYPES = require('./types')
const mqttService = require('../services/mqtt')

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

const mqttPublish = ( service, payload ) => {
  mqttService(service, payload)
}

module.exports = {
  setMqttServer: setMqttServer,
  setMqttClient: setMqttClient,
  mqttPublish: mqttPublish,
}
