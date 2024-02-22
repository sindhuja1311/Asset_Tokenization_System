import { SET_WALLET } from '../actions/types'; // Import action types

const initialState = {
  wallet: '', // Initial state for wallet
  // Other global state properties...
};

const globalReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_WALLET:
      return {
        ...state,
        wallet: action.payload,
      };
    
    // Other cases for additional actions...
    default:
      return state;
  }
};

export default globalReducer;
