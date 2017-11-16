const redux = require('redux')
const createLogger = require('redux-node-logger')
const rootReducer = require('../reducer')

const loggerMiddleware = createLogger();

module.exports = redux.createStore(
  rootReducer,
  undefined,
  redux.compose(
    redux.applyMiddleware( loggerMiddleware ),
  ),
);
