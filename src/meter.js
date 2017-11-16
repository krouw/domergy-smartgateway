const Zigbee = require('./zigbee')
const _ = require('lodash')
const store = require('./store')

module.exports = class Meter {

  constructor ( xbeeProductId ) {
    const validate = this._validateConstructor( xbeeProductId )
    if( _.isEmpty(validate) ) {
      this.zigbee = new Zigbee( xbeeProductId )
      this.store = store


      this.eventsZigbee()
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

    if( !store ) {
      console.log(store, 'error store');
    }

    return errors

  }

  getState() {
    console.log(this.store.getState());
    return this.store.getState()
  }

  bootstrap () {
    setInterval( async () => {
      console.log('Interval');
      try {
        await this.checkConnectZigbee()
      } catch (e) {
        console.log('error', e);
      }
    }, 10000)
  }

  async checkConnectZigbee () {
    console.log('var connect', this.zigbee.getConnect());
    if( !this.zigbee.getConnect() ) {
      console.log('checkConnectZigbee if');
      try {
        await this.connectZigbee()
      } catch (e) {
        throw e
      }
    }
  }

  eventsZigbee () {
    this.zigbee.on('packet', (data) => {
      console.log('packet', data);
    })
  }

  async connectZigbee () {
    console.log('connect');
    try {
      await this.zigbee.connectSerial()
      this.eventsZigbee()
    } catch (e) {
      throw e
    }
  }

  start (){
    //this.bootstrap()
  }

}
