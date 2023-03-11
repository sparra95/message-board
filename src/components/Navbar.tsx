import { useAccountContext } from "../context/AccountContextProvider";

const Navbar = () => {
  const { currentAccount, connectWallet } = useAccountContext();

  return (
    <div className="navbar">
      <h1 className="navbar-title">Message Board</h1>
      <span>
        <span className="account-text">
          {currentAccount || "Account info here..."}
        </span>
        {!currentAccount && (
          <button onClick={() => connectWallet()}>Connect Wallet</button>
        )}
      </span>
    </div>
  );
};

export default Navbar;
