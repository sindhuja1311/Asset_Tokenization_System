import { SET_WALLET } from './types'; // Import action types

export const setWallet = (wallet) => ({
  type: SET_WALLET,
  payload: wallet,
});
