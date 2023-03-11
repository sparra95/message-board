import { useEffect, useState } from "react";
import { useAccountContext } from "../context/AccountContextProvider";
import MessageOptions from "./MessageOptions";

// @todo
// [ ] useReducer!

const MessageBar = () => {
  const {
    currentAccount,
    contract,
    postMessage,
    isPostingMessage,
    calculateTotalFee,
  } = useAccountContext();
  const [message, setMessage] = useState("");
  const [customText, setCustomText] = useState("");
  const [gifId, setGifId] = useState("");
  const [messageDuration, setMessageDuration] = useState<number>(1);
  const [openOptionsPanel, setOpenOptionsPanel] = useState(false);
  const [totalCost, setTotalCost] = useState<number>(
    calculateTotalFee(messageDuration, customText, gifId)
  );

  const canPost = contract && currentAccount && !isPostingMessage;
  const buttontext = canPost ? "Add Message" : "Connect Wallet";
  const inputPlaceholder = canPost
    ? "Post Message"
    : "Connect wallet to add message";
  const styles = {
    cursor: canPost ? "pointer" : "not-allowed",
  };

  const handleSubmit = () => {
    postMessage(message, messageDuration, customText, gifId);
    setCustomText("");
    setGifId("");
    setMessage("");
    setMessageDuration(1);
  };

  useEffect(() => {
    setTotalCost(calculateTotalFee(messageDuration, customText, gifId));
  }, [gifId, customText, messageDuration]);

  return (
    <div
      style={{
        backgroundColor: " #242424",
        position: "fixed",
        left: "0",
        bottom: "0",
        width: "100%",
      }}
    >
      <div className="message-bar">
        <MessageOptions
          isOpen={openOptionsPanel}
          totalCost={totalCost}
          gifId={gifId}
          setGifId={setGifId}
          customText={customText}
          setCustomText={setCustomText}
          messageDuration={messageDuration}
          setMessageDuration={setMessageDuration}
        />
        <div>
          {/* MESSAGE INPUT */}
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={!canPost}
            placeholder={inputPlaceholder}
            style={styles}
            className="message-input"
          />
          {/* TOGGLE OPTIONS PANEL */}
          <button
            className="message-extras-button"
            disabled={!canPost}
            onClick={() => setOpenOptionsPanel((prev) => !prev)}
          >
            {openOptionsPanel ? "-" : "+"}
          </button>

          <div style={{ position: "relative" }}>
            {/* FEE COST */}
            <div
              style={{
                position: "absolute",
                top: !openOptionsPanel ? "-60%" : "0",
                left: "10%",
                color: !openOptionsPanel ? "inherit" : "transparent",
                transition: "all 0.3s ease-in-out",
                whiteSpace: "nowrap",
              }}
            >
              <label>Total Cost</label>
              <span style={{ margin: " 0 .5rem" }}>
                {calculateTotalFee(messageDuration, customText, gifId)}
              </span>
            </div>

            {/* POST MESSAGE */}
            <button
              className="message-post-button"
              style={styles}
              onClick={() => handleSubmit()}
              disabled={!canPost}
            >
              {buttontext}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBar;
