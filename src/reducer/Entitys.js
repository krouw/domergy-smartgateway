const initialState = {
  entitys: {}
}

const ADD_ENTITY = 'ADD_ENTITY'

module.exports = (state = initialState, action = {}) => {
  switch (action.type) {
    case ADD_ENTITY:
      return Object.assign({}, state, {
              value: state.value + 1,
             })
    default:
        return state;
  }
}
