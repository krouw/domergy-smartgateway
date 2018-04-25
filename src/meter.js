const Zigbee = require('./zigbee')
const _ = require('lodash')
const store = require('./store')
const moment = require('moment')
const ActionsMqtt = require('./actions/Mqtt')
const mqtt = require('mqtt')

module.exports = class Meter {

  constructor ( config ) {
    const validate = this._validateConstructor( config.id , config.xbeeProductId, config.mqtt )
    if( _.isEmpty(validate) ) {
      this.id = config.id
      this.zigbee = new Zigbee( config.xbeeProductId, store )
      this.store = store
      this.interval = config.interval || 10000
      this.mqttITCity = {
        server: 'pird.ddns.net',
        port: '1883',
      }
      this.mqttClient = mqtt.connect(`${config.mqtt.server}:${config.mqtt.port}`, {
        clientId: config.mqtt.client
       })
       this.mqttClientITCity = mqtt.connect(`${this.mqttITCity.server}:${this.mqttITCity.port}`, {
         clientId: config.mqtt.client
        })
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

  start () {
    this.bootstrap()


     this.mqttClient.on('connect', () => {
       this.mqttClient.subscribe('entity/relay/')
     });


    /*
    *
    * Fake Meter
    *
    *
    this.zigbee.fake()
    this.eventsZigbee()
    */
  }

  bootstrap () {
    setInterval( async () => {
      //console.log('Interval');
      try {
        await this.zigbee.checkConnectZigbee()
      } catch (e) {
        console.log('error', e);
      }
    }, this.interval)
    this.eventsZigbee()
    this.eventsMqtt()
  }

  eventsMqtt(){
    this.mqttClient.on('packetreceive', (packet) => {
       if ( packet.topic === 'entity/relay/' && packet.payload ) {
         const payload = JSON.parse(packet.payload.toString())
         if ( payload.id_attribute === '3333' ){
           if( payload.value  ){
             this.zigbee.sendZigbee('t')
           }
           else {
             this.zigbee.sendZigbee('f')
           }
         }
       }
   })
  }

  eventsZigbee () {
    this.zigbee.on('measurement', ( packet ) => {
      //console.log('packet', packet);
      this.buildFrame( packet )
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
        timestamp: moment( split[3]+'T'+split[4], "DD/MM/YYYYTHH:mm:ss", true).toDate()
      }

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

      if( !moment(payload.timestamp).isValid() ){
        console.log('timestamp inválido');
        payload.timestamp = moment.utc();
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
    const payload = {
      data: packet,
      topic: 'entity/attr/'
    }
    if (  _.isEmpty(payload) ) {
      return;
    }
     const data = JSON.stringify(payload.data);
     this.mqttClient.publish(payload.topic, data);
     this.mqttClientITCity.publish(payload.topic, data)
     console.log('MQTT message published: ', data);
  }

}
