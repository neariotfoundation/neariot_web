import getConfig from "./config";
import * as nearAPI from "near-api-js";
import { Web3Storage } from "web3.storage";
import Web3Connector from "./web3Connector";
import md5 from "md5";

const nearConfig = getConfig("testnet");
// const nearConfig = getConfig('mainnet');

export async function initContract() {
  const near = await nearAPI.connect({
    deps: {
      keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore(),
    },
    ...nearConfig,
    headers: {},
  });

  const walletConnection = new nearAPI.WalletConnection(near);

  let currentUser;

  if (walletConnection.getAccountId()) {
    currentUser = {
      accountId: walletConnection.getAccountId(),
      balance: (await walletConnection.account().state()).amount,
    };
  }

  const contract = await new nearAPI.Contract(
    walletConnection.account(),
    nearConfig.contractName,
    {
      viewMethods: [""],
      changeMethods: [
        "get_clusters",
        "get_cluster",
        "get_cluster_data",
        "new_cluster",
        "set_apikey_hash",
        "set_cluster",
        "remove_cluster",
        "join",
        "get_user",
        "create_project",
        "update_project",
        "get_user_projects_created",
        "get_project",
        "get_rcm_projects",
        "add_project_offer",
        "get_projects_watched",
        "get_projects_funded",
        "get_milestone",
        "set_milestone",
        "remove_from_watchlist",
        "approve_project",
        "reject_project",
        "add_to_watchlist",
        "buy_offer"
      ],
      sender: walletConnection.getAccountId(),
    }
  );

  return { contract, currentUser, nearConfig, walletConnection };
} 

export const generateUserId = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export function initWeb3Storage(token) {
  const apiKey = token;
  const web3Connector = new Web3Connector(apiKey);
  return {
    apiKey: web3Connector.apiKey,
    web3Connector: web3Connector,
  };
}

export function generateKey(content) {
  return md5(JSON.stringify(content));
}
