import { CLEAR_WALLET, UPDATE_WALLET } from "../action/wallet";

interface State {
  contract: {};
  currentUser: {};
  nearConfig: {};
  walletConnection: {};
}

const initState: State = {
  contract: {},
  currentUser: {},
  nearConfig: {},
  walletConnection: {},
};

const WalletReducer = (state = initState, content: any) => {
  const { type, value } = content;

  switch (type) {
    case CLEAR_WALLET:
      return onClearWallet();
    case UPDATE_WALLET:
      return onUpdateWallet(value);
    default:
      return state;
  }
};

const onClearWallet = () => {
  return initState;
};

const onUpdateWallet = ({
  contract,
  currentUser,
  nearConfig,
  walletConnection,
}: any) => {
  return {
    contract,
    currentUser,
    nearConfig,
    walletConnection,
  };
};

export default WalletReducer