const TYPES = require('./types')

const addEntity = ( entity ) => {
  return {
    type: TYPES.ADD_ENTITY,
    entity: entity,
  }
}

module.exports = {
  addEntity: addEntity,
}
