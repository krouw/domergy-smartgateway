const Zigbee = require('./DevComm/zigbee')
const _ = require('lodash')
const store = require('./store')
const moment = require('moment')
const ActionsMqtt = require('./actions/Mqtt')
const mqttClient = require('./services/mqtt')

module.exports = class SmartGateway {

  constructor ( config ) {
    const validate = this._validateConstructor( config.id , config.xbeeProductId, config.mqtt )
    if( _.isEmpty(validate) ) {
      this.id = config.id
      this.zigbee = new Zigbee( config.xbeeProductId, store )
      this.clientMQTT = new mqttClient( config.mqtt )
      this.store = store
      this.interval = config.interval || 10000
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

  async start () {
    try {
      await this.bootstrap()
    } catch (e) {
      console.error('Start Error', e)
    }
    /*
    *
    * Fake Meter
    *
    *
    this.zigbee.fake()
    this.eventsZigbee()
    */
  }

  async bootstrap () {
    setInterval( async () => {
      //console.log('Interval');
      try {
        await this.zigbee.checkConnectZigbee()
      } catch (e) {
        console.log('error', e);
      }
    }, this.interval)
    try {
      this.eventsZigbee()
      await this.clientMQTT.start()
    } catch (e) {
      throw e
    }
  }

  validateFrame ( packet ) {
   return new Promise((resolve, reject) => {
     let errors = {};
     const split = packet.split(',')
     const payload = {
       id_device: split[0],
       id_attribute: split[1],
       value: split[2],
       timestamp: moment( split[3]+'T'+split[4], "DD/MM/YYYYTHH:mm:ss", true).toDate()
     }
     const timestamp = moment.utc(payload.timestamp)
     const nowUTC = moment().utc()

     if( !_.isString(packet) || split.length != 5) {
       errors.packet = 'Paquete Invalido'
       reject(errors)
     }

     if( _.isEmpty(payload.id_attribute) || !_.isInteger(+payload.id_attribute) ) {
       errors.id_attribute = 'Parametro Invalido'
     }

     if( _.isEmpty(payload.id_device) ) {
       errors.id_device = 'Parametro Invalido'
     }

     if( !moment(payload.timestamp).isValid() || (nowUTC.diff( timestamp , 'hours' ) != 0) ){
       payload.timestamp = nowUTC.format()
     }

     if( _.isEmpty(payload.value) || !isFinite(+payload.value) ){
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
       this.publish(payload)
     })
     .catch((err) => {
       console.error(err);
     })
 }

 async publish ( message ) {
   const topic = `device/${message.id_device}/attrs/${message.id_attribute}`
   const payload = {
     timestamp: message.timestamp,
     value: message.value,
   }
   try {
     await this.clientMQTT.publish( topic, payload )
   } catch (e) {
     console.error('error',e)
     throw e
   }
 }


  eventsZigbee () {
    this.zigbee.on('measurement', ( payload ) => {
      this.buildFrame( payload )
    })
  }

  log(message) {
    console.log(new Date().toString(), message);
  }
}
