const SerialPort = require('serialport');
const xbee_api = require('xbee-api');
const _ = require('lodash')
const moment = require('moment')
const isJSON = require('../util/isJSON')
const EventEmitter = require('events');
const ActionsZigbee = require('./actions/zigbee')
var C = xbee_api.constants;
const util = require('util')

module.exports = class Zigbee extends EventEmitter {

  constructor ( xbeeProductId, store ) {
    super()
    const validate = this._validateConstructor( xbeeProductId, store )

    if( _.isEmpty(validate) ) {
      this.xbee = new xbee_api.XBeeAPI({
        api_mode: 2
      });
      this.store = store
      this.Serial = {}

      this.setProductId(xbeeProductId)

    }
    else {
      throw new Error(JSON.stringify(validate))
    }
  }

  _validateConstructor( xbeeProductId, store ) {

    let errors = {}

    if( !_.isString( xbeeProductId ) ){
      errors.xbeeProductId = "Parametro Invalido"
    }

    if( !store ) {
      errors.store = 'Error Store'
    }

    return errors

  }

  getConnect () {
    return this.store.getState().Zigbee.connect
  }

  setConnect ( Connect ) {
    this.store.dispatch( ActionsZigbee.setConnect( Connect ) )
  }

  getProductId () {
    return this.store.getState().Zigbee.productId
  }

  setProductId ( xbeeProductId ) {
    this.store.dispatch( ActionsZigbee.setProductID( xbeeProductId ) )
  }

  setPortSerial ( port ) {
    this.store.dispatch( ActionsZigbee.setPortSerial( port ) )
  }

  getPortSerial ( port ) {
    return this.store.getState().Zigbee.SerialPort
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

   findPort () {
    return new Promise((resolve, reject) => {
      let result;
      SerialPort.list( (err, ports) => {
        if (err) {
          throw err
        }
        else {
          const filter = ports.filter( (port) => {
            const productId = this.getProductId()
            const parseId = '0x' + productId
            if ( port.productId === productId || port.productId === parseId ) {
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
      this.setPortSerial(port)
      this.Serial = new SerialPort(this.getPortSerial().comName, {
        baudRate: 57600,
        parser: this.xbee.rawParser(),
        autoOpen: false,
      })
    }
    catch (e) {
      throw e
    }
  }

  openPort () {
    return new Promise( (resolve, reject) => {
      this.Serial.open((err) => {
        if (err) {
          reject(err)
        }
        else {
          this.sendZigbee('t')
          this.setConnect( this.Serial.isOpen() )
          this.log('Serial Port Conectado')
          resolve()
        }
      })
    })
  }

    sendZigbee( data ) {
      var frame = {
          type: 0x10,
          id: 0x01,
          destination64: "0013a20041517745",
          broadcastRadius: 0x00,
          options: 0x00,
          data,
        };

      this.Serial.write(this.xbee.buildFrame(frame), (err, res) => {
          if (err) throw(err);
          else     console.log("Message");
      });
    }

  async checkConnectZigbee () {
    console.log('var connect', this.getConnect());
    if( !this.getConnect() ) {
      console.log('checkConnectZigbee if');
      try {
        await this.connectSerial()
      } catch (e) {
        throw e
      }
    }
  }

  routerZigbee ( action ) {
    console.log('action', action);
    switch (action.type) {
      case 144:
        const messageZB = action.data.toString();
        this.emit('measurement', messageZB)
        break;
      default:
        break;
    }
  }

  eventsSerial () {
    this.xbee.on("frame_object", (frame) => {
      this.routerZigbee(frame)
    });

    this.Serial.on('disconnect', () => {
      this.setConnect( false )
    })
  }

  log(message) {
    console.log(new Date().toString(), message);
  }

  fake () {

    const hexEncode = (str) => {
      var hex = '';
      for(var i=0;i<str.length;i++) {
        hex += ''+str.charCodeAt(i).toString(16);
      }
      return hex;
    }

    setInterval( () => {
      const frame = `03,3316,1.2,${moment().format("DD/MM/YYYY")},${moment().format("HH:mm:ss")}`
      const object = {
        data: new Buffer( hexEncode(frame) , 'hex'),
        type: 144,
      }

      this.routerZigbee(object)
    }, 5000)

  }

}
