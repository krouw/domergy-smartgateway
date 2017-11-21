const TYPES = require('../actions/types')

const initialState = {
  mqttActive: false,
  pinged: { },
  server: '',
}

module.exports = (state = initialState, action = {}) => {
  switch (action.type) {
    case TYPES.SET_MQTTSERVER:
      return Object.assign({}, state, {
              server: action.server
             })
    default:
        return state;
  }
}
