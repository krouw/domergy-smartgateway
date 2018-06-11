const mqtt = require('mqtt')
const toJSON = require('../../util/isJSON')
const EventEmitter = require('events')

module.exports = class MqttTransport extends EventEmitter {

  constructor ( config ) {
    super()
    this.host = config.host
    this.port = config.port
    this.client = {}
    this.clientId = config.client
    this.password = config.password
    this.topics = config.topics
  }

  async connect (  ) {
    try {
      this.client = mqtt.connect(`mqtt://${this.host}:${this.port}`,{
        clientId: this.clientId,
        username: this.clientId,
        password: this.password,
        reconnectPeriod: 10000,
      })
    } catch (e) {
        throw e
    }
  }

  async start () {
    try {
      this.connect()
      this.mqttEvents()
      await this.subscribe ( this.topics )
    } catch (e) {
      throw e
    }
  }

  mqttEvents () {

    /*
    *  Client Events
    */
    this.client.on('connect', (connack) => {
      console.log('MQTT ==> Cliente Conectado');
      this.status = 'online'
    })

    this.client.on('reconnect', () => {
      console.log('MQTT ==> Reconectando');
    })

    this.client.on('offline', () => {
      this.status = 'offline'
      console.log('MQTT ==> offline');
    })

    this.client.on('error', (error) => {
      this.status = 'offline'
      console.log('MQTT ==> Error Conexión.');
    })

    this.client.on('close', () => {
      this.status = 'offline'
      console.log('MQTT ==> Close');
    })

    /*
    *  Message Event
    */

    this.client.on('message', (topic, message, packet) => {
      /* console.log('MQTT ==> New Message');
      * console.log('packet', packet);
      * console.log('MQTT ==> Topic:', topic);
      * console.log('MQTT ==> Message:', message.toString());
      */
      this.emit ( `${this.name}/message`, { topic, payload: toJSON(message), packet } )
    })
    /*
    this.client.on('packetsend', (packet) => {
      console.log('MQTT ==> Message Send');
      console.log('MQTT ==> Packet:', packet);
    })

    this.client.on('packetreceive', (packet) => {
      console.log('MQTT ==> Message Receive');
      console.log('MQTT ==> Packet:', packet);
    })
    */
  }

  publish ( topic, message, options ) {
    return new Promise((resolve, reject) => {
      const payload = JSON.stringify(message)
      this.client.publish( topic, payload, options, (err) => {
        if ( err ){
          reject (err)
        }
        else {
          resolve ()
        }
      })
    });
  }

  subscribe ( topics, options ) {
    return new Promise((resolve, reject) => {
      if ( (this.status === 'online') ) {
        this.client.subscribe( topics, options, (err) => {
          if(err){
            reject (err)
          }
          else {
            resolve ()
          }
        })
      }
      else {
        reject('MQTT ==> MQTT OFFLINE')
      }
    });
  }

}
