import initialState from './initialState';

export function userReducer(state = initialState.user, action) {
  switch (action.type) {
    case 'SIGNIN':
      return { ...action.payload }
    case 'LOGOUT':
      return { state }
    case 'REFRESH-USER':
      return { ...state, ...action.payload }
    default:
      return state;
  }
}