const initialState = {
  status: {}
}

const ADD_VALUE = 'ADD_VALUE'

module.exports = (state = initialState, action = {}) => {
  switch (action.type) {
    case ADD_VALUE:
      return Object.assign({}, state, {
              value: state.value + 1,
             })
    default:
        return state;
  }
}
