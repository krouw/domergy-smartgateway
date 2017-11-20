const Zigbee = require('./zigbee')
const _ = require('lodash')
const store = require('./store')

module.exports = class Meter {

  constructor ( xbeeProductId ) {
    const validate = this._validateConstructor( xbeeProductId )
    if( _.isEmpty(validate) ) {
      this.zigbee = new Zigbee( xbeeProductId, store )
      this.store = store

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
      console.log('packet', data);
    })
  }

}
