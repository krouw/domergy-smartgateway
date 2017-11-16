const SerialPort = require('serialport');
const xbee_api = require('xbee-api');
const _ = require('lodash')
const isJSON = require('../util/isJSON')
const EventEmitter = require('events');

module.exports = class Zigbee extends EventEmitter {

  constructor ( xbeeProductId ) {
    super()
    const validate = this._validateConstructor( xbeeProductId )

    if( _.isEmpty(validate) ) {
      this.xbee = new xbee_api.XBeeAPI({
        api_mode: 2
      });
      this.xbeeProductId = xbeeProductId
      this.portInfo = {}
      this.port = {}
      this.connect = false

      this.fake()
    }
    else {
      throw new Error(JSON.stringify(validate))
    }
  }

  _validateConstructor( xbeeProductId ) {

    let errors = {}

    if( !_.isString( xbeeProductId ) ){
      errors.xbeeProductId = "Parametro Invalido"
    }

    return errors

  }

   findPort () {
    return new Promise((resolve, reject) => {
      let result;
      SerialPort.list( (err, ports) => {
        if (err) {
          throw err
        }
        else {
          const filter = ports.filter( (port) => {
            const parseId = '0x' + this.xbeeProductId
            if ( port.xbeeProductId === this.xbeeProductId  || port.xbeeProductId === parseId ) {
              return true
            }
          })
          if ( !_.isEmpty(filter) ) {
            result = filter[0]
            resolve(result)
          }
          else {
            reject('No se han Encontrado puertos seriales')
          }
        }
      })
    });
  }

  async setPort ( ) {
    try {
      const port = await this.findPort()
      this.portInfo = port;
      this.port = new SerialPort(this.portInfo.comName, {
        baudrate: 57600,
        parser: this.xbee.rawParser(),
        autoOpen: false,
      })
    }
    catch (e) {
      throw e
    }
  }

  setConnect () {
    this.connect = this.port.isOpen()
  }

  getConnect () {
    return this.connect
  }

  openPort () {
    return new Promise( (resolve, reject) => {
      this.port.open((err) => {
        if (err) {
          reject(err)
        }
        else {
          this.setConnect()
          this.log('Serial Port Conectado')
          resolve()
        }
      })
    })
  }

  routerZigbee ( action ) {
    const buff = action.data.toString()
    console.log('buff', buff);
    switch (action.type) {
      case 144:
        if( isJSON(buff) ){
          console.log('buff json', buff);
          this.emit('packet', JSON.parse(buff))
        }
        break;
      default:
        break;
    }
  }

  eventsSerial () {
    this.xbee.on("frame_object", (frame) => {
      this.routerZigbee(frame)
    });

    this.port.on('close', () => {
      this.setConnect()
    })
  }

  async connectSerial () {
    try {
      await this.setPort()
      await this.openPort()
      this.eventsSerial()
    } catch (e) {
      throw e
    }
  }

  log(message) {
    console.log(new Date().toString(), message);
  }

  fake(){
    const object = {
      data: new Buffer('7b2276223a312e357d', 'hex'),
      type: 144,
    }

    setInterval( () => {
      this.routerZigbee(object)
    }, 10000)

  }

}
