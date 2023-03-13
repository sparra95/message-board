import React, { useState, useContext, useEffect } from "react";
import { ethers, BigNumber } from "ethers";
import ABI from "../abi.json";
import { GiphyFetch } from "@giphy/js-fetch-api";
import { testData } from "../testData";

type AccountContextType = {
  currentAccount: string;
  balance: string;
  messageNodes: MessageNode[];
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  getMessageNodes: () => Promise<void>;
  postMessage: (
    message: string,
    messageDuration: number,
    customText: string,
    gifId: string
  ) => Promise<void>;
  isPostingMessage: boolean;
  newMessagesAvailable: boolean;
  setNewMessagesAvailable: (value: boolean) => void;
  GF: GiphyFetch;
  calculateTotalFee: (
    messageDuration: number,
    customText: string,
    gifId: string
  ) => number;
};

type Props = {
  children: React.ReactNode;
};

export type MessageNode = {
  next: string;
  expDate: BigNumber;
  customText: string;
  gif: string;
  message: string;
};

export const AccountContext = React.createContext<AccountContextType | null>(
  null
);
export const useAccountContext = () => useContext(AccountContext)!;

const CONTRACT_ADDRESS: string = "0x40d34637EECA0DdcC4C50cF4Eaa07B53E3B45faF";
const FEE: number = 0.001; // ETH // @todo make dynamic based on contract

const GF: GiphyFetch = new GiphyFetch("oqTeU24IyRyDllvK20Ls2rX46j2pLmXS");

const PROVIDER: ethers.providers.Web3Provider =
  new ethers.providers.Web3Provider(window.ethereum);
const SIGNER: ethers.providers.JsonRpcSigner = PROVIDER.getSigner();
const CONTRACT: ethers.Contract = new ethers.Contract(
  CONTRACT_ADDRESS,
  ABI,
  SIGNER
);

// @todo
// - [ ] figure out why disconnectWallet is slow? -> invokeGuardedCallback is doing something weird...
// maybe answer is here: https://www.npmjs.com/package/@fvilers/disable-react-devtools

const AccountContextProvider = ({ children }: Props): JSX.Element => {
  const [currentAccount, setCurrentAccount] = useState<string>("");
  const [balance, setBalance] = useState<string>("");
  const [messageNodes, setMessageNodes] = useState<MessageNode[]>(testData);
  const [isPostingMessage, setIsPostingMessage] = useState<boolean>(false);
  const [newMessagesAvailable, setNewMessagesAvailable] =
    useState<boolean>(false);

  const connectWallet = async () => {
    if (!PROVIDER) {
      console.log("No provider. Cannot connect wallet.");
      return;
    }

    try {
      const accounts = await PROVIDER.send("eth_requestAccounts", []);
      const balance = await PROVIDER.getBalance(accounts[0]);

      setCurrentAccount(accounts[0]);
      setBalance(ethers.utils.formatEther(balance));
      getMessageNodes(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const disconnectWallet = () => {
    setCurrentAccount("");
    setBalance("");
  };

  const getMessageNodes = async (_currentAccount?: string): Promise<void> => {
    const myCurrentAccount = _currentAccount || currentAccount;
    if (!CONTRACT || !myCurrentAccount) {
      console.log("No contract or account connected. Cannot get messages.");
      return;
    }

    try {
      const messageNodes: MessageNode[] =
        await CONTRACT.getNonExpiredMessageNodes();
      const messageNodeObjects: MessageNode[] = messageNodes.map(
        (messageNode: MessageNode) => {
          return {
            next: messageNode.next,
            message: messageNode.message,
            expDate: messageNode.expDate,
            customText: messageNode.customText,
            gif: messageNode.gif,
          };
        }
      ) as MessageNode[];

      if (!!messageNodeObjects?.length) {
        setMessageNodes([...testData, ...messageNodeObjects]);
        setNewMessagesAvailable(true);
      }
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
    if (!currentAccount || !CONTRACT || !message || messageDuration < 1) {
      console.error("Requirement error in PostMessage()");
      return;
    }

    const totalFee = calculateTotalFee(messageDuration, customText, gifId);

    setIsPostingMessage(true);
    try {
      const tx = await CONTRACT.postMessage(message, customText, gifId, {
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

  console.log("rendering AccountContextProvider");
  console.table({
    currentAccount,
    balance,
    isPostingMessage,
    newMessagesAvailable,
    GF,
  });

  return (
    <AccountContext.Provider
      value={{
        currentAccount,
        balance,
        messageNodes,
        connectWallet,
        disconnectWallet,
        getMessageNodes,
        postMessage,
        isPostingMessage,
        newMessagesAvailable,
        setNewMessagesAvailable,
        GF,
        calculateTotalFee,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export default AccountContextProvider;
