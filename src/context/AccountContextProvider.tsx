import React, { useState, useContext, useEffect } from "react";
import { ethers, BigNumber } from "ethers";
import ABI from "../abi.json";
import { GiphyFetch } from "@giphy/js-fetch-api";
import { testData } from "../testData";

type AccountContextType = {
  currentAccount: string;
  contract: ethers.Contract | null;
  balance: string;
  messageNodes: MessageNode[];
  connectWallet: () => Promise<void>;
  getMessageNodes: () => Promise<void>;
  postMessage: (
    message: string,
    messageDuration: number,
    customText: string,
    gifId: string
  ) => Promise<void>;
  isPostingMessage: boolean;
  GF: GiphyFetch;
  calculateTotalFee: (
    messageDuration: number,
    customText: string,
    gifId: string
  ) => number;
};

type PropTypes = {
  children: React.ReactNode;
};

type ContractMessageNode = {
  next: string;
  expDate: BigNumber;
  customText: string;
  gif: string;
  message: string;
};

export type MessageNode = {
  next: string;
  expDate: number; // @todo string? BigNumber?
  customText: string;
  gif: string;
  message: string;
};

export const AccountContext = React.createContext<AccountContextType | null>(
  null
);
export const useAccountContext = () => useContext(AccountContext)!;

const CONTRACT_ADDRESS = "0x40d34637EECA0DdcC4C50cF4Eaa07B53E3B45faF";
const FEE = 0.001; // ETH // @todo make dynamic based on contract

const GF = new GiphyFetch("oqTeU24IyRyDllvK20Ls2rX46j2pLmXS");

// @todo
// - [x] absolute position price when options panel is open
// - [x] Fix Header text sizes
// - [x] Autoconnect to wallet if possible
// - [x] add icons
// - [ ] Add disconnect wallet button in navbar
// - [ ] add mini popup "New Messages <downArrow>" when new message is posted
// - [x] remove testPostMessage
// - [ ] add loading spinner when posting message
// - [x] remove tailwind
// - [ ] properly type ContractMessageNodes
// - [ ] show wallet balance

const AccountContextProvider = ({ children }: PropTypes): JSX.Element => {
  const [currentAccount, setCurrentAccount] = useState<string>("");
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [provider, setProvider] =
    useState<ethers.providers.Web3Provider | null>(null);
  const [balance, setBalance] = useState<string>(""); // number?
  const [messageNodes, setMessageNodes] = useState<MessageNode[]>(testData);
  const [isPostingMessage, setIsPostingMessage] = useState<boolean>(false);

  const getProvider = () => {
    if (!window.ethereum || !window.ethereum.isMetaMask) {
      console.log("No MetaMask. Cannot get provider.");
      return null;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);

    return provider;
  };

  const getContract = (_provider?: ethers.providers.Web3Provider | null) => {
    const myProvider = _provider || provider;
    if (!myProvider) {
      console.log("No provider. Cannot get contract.");
      return null;
    }

    const signer = myProvider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
    setContract(contract);

    return contract;
  };

  const connectWallet = async (
    _provider?: ethers.providers.Web3Provider | null,
    _contract?: ethers.Contract | null
  ) => {
    const myProvider = _provider || provider;
    if (!myProvider) {
      console.log("No provider. Cannot connect wallet.");
      return;
    }

    try {
      const accounts = await myProvider.send("eth_requestAccounts", []);
      const balance = await myProvider.getBalance(accounts[0]);

      setCurrentAccount(accounts[0]);
      setBalance(ethers.utils.formatEther(balance));
      //setContract(contract);
      if (_contract) {
        getMessageNodes(_contract, accounts[0]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const disconnectWallet = () => {
    setCurrentAccount("");
    setBalance("");
    setContract(null);
  };

  const getMessageNodes = async (
    _contract?: ethers.Contract,
    _currentAccount?: string
  ) => {
    const myContract = _contract || contract;
    const myCurrentAccount = _currentAccount || currentAccount;
    if (!myContract || !myCurrentAccount) {
      console.log("No contract or account connected. Cannot get messages.");
      return;
    }

    try {
      // @todo properly type ContractMessageNodes
      const messageNodes = await myContract.getNonExpiredMessageNodes();
      const messageNodeObjects: MessageNode[] = messageNodes.map(
        (messageNode: MessageNode) => {
          return {
            next: messageNode.next,
            message: messageNode.message,
            expDate: messageNode.expDate, // @todo convert big number to number? or wait until needed?.. conversion may throw error, so wait until needed
            customText: messageNode.customText,
            gif: messageNode.gif,
          };
        }
      ) as MessageNode[];

      console.log("messageNodeObjects");
      console.log([...testData, ...messageNodeObjects]);

      setMessageNodes([...testData, ...messageNodeObjects]);
    } catch (error) {
      console.error(error);
    }
  };

  const calculateTotalFee = (
    messageDuration: number,
    customText: string,
    gifId: string
  ) => {
    let newCost = FEE;

    if (customText !== "") {
      newCost += FEE;
    }

    if (gifId !== "") {
      newCost += FEE;
    }

    if (messageDuration > 1) {
      newCost += FEE * (messageDuration - 1);
    }

    newCost = Number.parseFloat(newCost.toFixed(3));

    return newCost;
  };

  const postMessage = async (
    message: string,
    messageDuration: number,
    customText: string,
    gifId: string
  ) => {
    if (!currentAccount || !contract || !message || messageDuration < 1) {
      console.error("Requirement error in PostMessage()");
      return;
    }

    const totalFee = calculateTotalFee(messageDuration, customText, gifId);

    setIsPostingMessage(true);
    try {
      const tx = await contract.postMessage(message, customText, gifId, {
        value: ethers.utils.parseEther(String(totalFee)),
      });
      await tx.wait();
      getMessageNodes();
    } catch (error) {
      console.error(error);
    } finally {
      setIsPostingMessage(false);
    }
  };

  useEffect(() => {
    const provider = getProvider();
    const contract = getContract(provider);
    connectWallet(provider, contract);
  }, []);

  return (
    <AccountContext.Provider
      value={{
        currentAccount,
        contract,
        balance,
        messageNodes,
        connectWallet,
        getMessageNodes,
        postMessage,
        isPostingMessage,
        GF,
        calculateTotalFee,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export default AccountContextProvider;
