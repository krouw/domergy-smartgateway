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
      console.log('Interval');
      try {
        await this.zigbee.checkConnectZigbee()
      } catch (e) {
        console.log('error', e);
      }
    }, 10000)
    this.eventsZigbee()
  }

  getState() {
    console.log(this.store.getState());
    return this.store.getState()
  }

  eventsZigbee () {
    this.zigbee.on('measurement', (data) => {
      //console.log('packet', data);
      this.buildFrame(data)
    })
  }

  validateAttribute ( attribute ) {
    return new Promise((resolve, reject) => {
      let errors = {};

      if( _.isEmpty(attribute.id_attribute) || !_.isNumber(parseInt(attribute.id_attribute)) ){
        errors.id_attribute = 'Parametro Invalido'
      }

      if( _.isEmpty(attribute.id_device) || !_.isNumber(parseInt(attribute.id_device))){
        errors.id_device = 'Parametro Invalido'
      }

      if( !_.isDate(attribute.timestamp) ){
        errors.timestamp = 'Parametro Invalido'
      }

      if( _.isEmpty(attribute.value) || !_.isNumber(parseInt(attribute.value)) ){
        errors.value = 'Parametro Invalido'
      }

      if( _.isEmpty(errors)  ){
        resolve()
      }
      else {
        reject(errors)
      }

    })
  }

  buildFrame( packet ) {
    if( _.isString(packet) ) {
      const split = packet.split(',')
      const payload = {
        id_device: split[0],
        id_attribute: split[1],
        value: split[2],
        timestamp: moment( split[3]+'T'+split[4], "DD/MM/YYYYTHH:mm:ss").toDate()
      }

      this.validateAttribute( payload )
        .then((value) => {
          this.mqttPublish(payload)
        })
        .catch((err) => {
          console.log('Error Build Frame', err)
        })
    }
    else {
      this.log('Error Packet')
    }
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
