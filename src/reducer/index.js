const redux = require('redux')
const Entitys = require('./Entitys')
const Mqtt = require('./Mqtt')
const Zigbee = require('./Zigbee')

module.exports = redux.combineReducers({
  Entitys,
  Mqtt,
  Zigbee
});
