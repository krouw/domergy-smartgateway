const Zigbee = require('./zigbee')
const _ = require('lodash')
const store = require('./store')
const moment = require('moment')
const ActionsMqtt = require('./actions/Mqtt')

module.exports = class Meter {

  constructor ( id, xbeeProductId, mqttConfig ) {
    const validate = this._validateConstructor( id, xbeeProductId, mqttConfig )
    if( _.isEmpty(validate) ) {
      this.id = id
      this.zigbee = new Zigbee( xbeeProductId, store )
      this.store = store

      this.setMqttServer( mqttConfig.server )
      this.setMqttClient( mqttConfig.client )
    }
    else {
      throw new Error(JSON.stringify(validate))
    }
  }

  _validateConstructor( id, xbeeProductId, mqttConfig ) {

    let errors = {}

    if( !_.isString( xbeeProductId ) ){
      errors.xbeeProductId = "Parametro Invalido"
    }

    if( _.isEmpty( mqttConfig ) ){
      errors.mqttConfig = "Parametro Invalido"
    }

    if( _.isEmpty(id) ) {
      errors.id = 'Parametro Invalido'
    }

    if( !store ) {
      errors.store = 'Error Store'
    }

    return errors

  }

  start (){
    this.bootstrap()
  }

  bootstrap () {
    setInterval( async () => {
      //console.log('Interval');
      try {
        await this.zigbee.checkConnectZigbee()
      } catch (e) {
        console.log('error', e);
      }
    }, 10000)
    this.eventsZigbee()
  }

  eventsZigbee () {
    this.zigbee.on('measurement', (data) => {
      //console.log('packet', data);
      this.buildFrame(data)
    })
  }

  validateFrame ( packet ) {
    return new Promise((resolve, reject) => {
      let errors = {};
      const split = packet.split(',')
      const payload = {
        id_device: split[0],
        id_attribute: split[1],
        value: split[2],
        timestamp: moment( split[3]+'T'+split[4], "DD/MM/YYYYTHH:mm:ss").toDate()
      }

      if( !_.isString(packet) || !split.length == 5) {
        errors.packet = 'Paquete Invalido'
        reject(errors)
      }

      if( _.isEmpty(payload.id_attribute) || !_.isNumber(parseInt(payload.id_attribute)) ){
        errors.id_attribute = 'Parametro Invalido'
      }

      if( _.isEmpty(payload.id_device) || !_.isNumber(parseInt(payload.id_device))){
        errors.id_device = 'Parametro Invalido'
      }

      if( !_.isDate(payload.timestamp) ){
        errors.timestamp = 'Parametro Invalido'
      }

      if( _.isEmpty(payload.value) || !_.isNumber(parseInt(payload.value)) ){
        errors.value = 'Parametro Invalido'
      }

      if( _.isEmpty(errors)  ){
        resolve(payload)
      }
      else {
        reject(errors)
      }

    })
  }

  buildFrame( packet ) {
    this.validateFrame( packet )
      .then((payload) => {
        this.mqttPublish(payload)
      })
      .catch((err) => {
        console.error(err);
      })
  }

  setMqttServer ( server ) {
    this.store.dispatch( ActionsMqtt.setMqttServer( server ) )
  }

  getMqttServer ( ) {
    return this.store.getState().Mqtt.server
  }

  setMqttClient ( client ) {
    this.store.dispatch ( ActionsMqtt.setMqttClient(client) )
  }

  getMqttClient ( ) {
    return this.store.getState().Mqtt.client
  }

  log(message) {
    console.log(new Date().toString(), message);
  }

  mqttPublish ( packet ) {
    const service = {
      server: this.getMqttServer(),
      client: this.getMqttClient() }
    const payload = {
      data: packet,
      topic: 'entity/attr/'
    }
    ActionsMqtt.mqttPublish( service, payload )
  }

}
