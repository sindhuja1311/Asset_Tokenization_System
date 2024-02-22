// store.js
import { configureStore, combineReducers } from '@reduxjs/toolkit'; // Updated import statement
import globalReducer from './reducers/globalReducer';
import { initialGlobalState } from './states/globalState';

const rootReducer = combineReducers({
  global: globalReducer,
});

const store = configureStore({
  reducer: rootReducer,
  preloadedState: { global: initialGlobalState }, // Initialize global state
});

export default store;
