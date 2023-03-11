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
  testPostMessage: (
    message: string,
    messageDuration: number,
    customText: string,
    gifId: string
  ) => void;
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

const CONTRACT_ADDRESS = "0x40d34637EECA0DdcC4C50cF4Eaa07B53E3B45faF"; //"0x40265797E76D243e356aD9a1a6B4F3483B5e81B4";
const FEE = 0.001; // ETH // @todo make dynamic based on contract

const GF = new GiphyFetch("oqTeU24IyRyDllvK20Ls2rX46j2pLmXS");

// @todo
// - [ ] absolute position price when options panel is open
// - [ ] Fix Header text sizes
// - [ ] Autoconnect to wallet if possible
// - [ ] add mini popup "New Messages <downArrow>" when new message is posted

const AccountContextProvider = ({ children }: PropTypes): JSX.Element => {
  const [currentAccount, setCurrentAccount] = useState<string>("");
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [provider, setProvider] =
    useState<ethers.providers.Web3Provider | null>(null);
  const [balance, setBalance] = useState<string>(""); // number?
  const [messageNodes, setMessageNodes] = useState<MessageNode[]>(testData);
  const [isPostingMessage, setIsPostingMessage] = useState<boolean>(false);

  const getContract = () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
    setContract(contract);
    setProvider(provider);
  };

  const connectWallet = async () => {
    if (!window.ethereum || !window.ethereum.isMetaMask || !provider) {
      console.log("MetaMask not found OR no provider");
      return;
    }

    try {
      const accounts = await provider.send("eth_requestAccounts", []);
      const balance = await provider.getBalance(accounts[0]);

      setCurrentAccount(accounts[0]);
      setBalance(ethers.utils.formatEther(balance));
      setContract(contract);
    } catch (error) {
      console.log(error);
    }
  };

  const getMessageNodes = async () => {
    if (!contract || !currentAccount) {
      console.log("No contract or account connected");
      return;
    }

    try {
      // @todo properly type ContractMessageNodes
      const messageNodes = await contract.getNonExpiredMessageNodes();
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

      console.log("messageNodes from contract");
      console.log(messageNodes);
      console.log("messageNodeObjects from contract");
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

  // @note testing only
  const testPostMessage = async (
    message: string,
    messageDuration: number,
    customText: string,
    gifId: string
  ) => {
    if (!message || messageDuration < 1) {
      console.error("Requirement error in PostMessage()");
      return;
    }

    const totalFee = calculateTotalFee(messageDuration, customText, gifId);

    const testProducedMessage: MessageNode = {
      next: "",
      expDate: 0,
      customText: customText,
      gif: gifId,
      message: message,
    };

    console.log("Produced MessageNode");
    console.log("Total Fee: ", totalFee);
    console.log(testProducedMessage);

    setMessageNodes([...messageNodes, testProducedMessage]);
  };

  useEffect(() => {
    getContract();
  }, []);

  useEffect(() => {
    getMessageNodes();
  }, [contract, currentAccount]);

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
        testPostMessage,
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
