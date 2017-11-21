const TYPES = require('./types')

const setProductID = (productId) => {
  return {
    type: TYPES.SET_PRODUCTID,
    productId: productId,
  }
}

const setPortSerial = ( SerialPort ) => {
  return {
    type: TYPES.SET_SERIALPORT,
    SerialPort: SerialPort,
  }
}

const setConnect = ( Connect ) => {
  return {
    type: TYPES.SET_ZIGBEECONNECT,
    connect: Connect,
  }
}

module.exports = {
  setProductID: setProductID,
  setPortSerial: setPortSerial,
  setConnect: setConnect,
}
