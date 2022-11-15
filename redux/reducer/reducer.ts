import { combineReducers } from 'redux';
import WalletReducer from './walletreducer';
import W3StorageReducer from './w3storagereducer';

const reducer = combineReducers({
    wallet:WalletReducer,
    w3storage: W3StorageReducer,
})

export default reducer;