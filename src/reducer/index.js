const redux = require('redux')
const Entitys = require('./Entitys')
const Mqtt = require('./Mqtt')

module.exports = redux.combineReducers({
  Entitys,
  Mqtt,
});
