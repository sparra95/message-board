import { BiWalletAlt } from "react-icons/bi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaRegAddressBook, FaEthereum } from "react-icons/fa";
import { useAccountContext } from "../context/AccountContextProvider";
import React from "react";

const Navbar = () => {
  const {
    currentAccount,
    balance,
    connectWallet,
    disconnectWallet,
    isPostingMessage,
  } = useAccountContext();
  const formattedAccNumber = currentAccount
    ? currentAccount.slice(0, 6) + "..." + currentAccount.slice(-4)
    : "";

  const handleClick = (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!!currentAccount) {
      console.log("Disconnecting");
      disconnectWallet();
      //debugger;
    } else {
      console.log("Connecting");
      connectWallet();
    }
  };

  console.log("rendering navbar");

  return (
    <div className="navbar">
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <h1 className="navbar-title">Message Board</h1>
        {isPostingMessage && (
          <AiOutlineLoading3Quarters className="loading-icon" />
        )}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <span className="account-text">
          {currentAccount ? (
            <>
              <FaRegAddressBook fontSize={"1.25rem"} /> {formattedAccNumber}
              <FaEthereum fontSize={"1.25rem"} /> {balance}
            </>
          ) : (
            "Account info here..."
          )}
        </span>
        <button
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: ".5rem",
          }}
          disabled={isPostingMessage}
          onClick={(e) => handleClick(e)}
        >
          {!!currentAccount ? (
            <>
              Disconnect <BiWalletAlt />
            </>
          ) : (
            <>
              Connect Wallet <BiWalletAlt />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Navbar;
