const TYPES = require('../actions/types')

const initialState = {
  productId: {},
  SerialPort: {},
  connect: false
}

module.exports = (state = initialState, action = {}) => {
  switch (action.type) {
    case TYPES.SET_PRODUCTID:
      return Object.assign({}, state, {
              productId: action.productId,
             })
    case TYPES.SET_SERIALPORT:
      return Object.assign({}, state, {
              SerialPort: action.SerialPort,
             })
    case TYPES.SET_CONNECT:
      return Object.assign({}, state, {
             connect: action.connect,
            })
    default:
        return state;
  }
}
