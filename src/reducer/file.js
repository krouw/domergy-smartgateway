const TYPES = require('../actions/types')

const initialState = {
  entities: {},
}

module.exports = (state = initialState, action = {}) => {
  switch (action.type) {
    case TYPES.ADD_ENTITY:
      const newEntities = Object.assign({}, state.entities)
      newEntities[action.entity.id] = action.entity
      return Object.assign({}, state, {
        entities: newEntities
      })

    default:
        return state;
  }
}
