import { useEffect, useState } from "react";
import { useAccountContext } from "../context/AccountContextProvider";
import MessageOptions from "./MessageOptions";
import { BsArrowUpRight } from "react-icons/bs";
import { AiOutlineSetting } from "react-icons/ai";
import { FaEthereum } from "react-icons/fa";

const MessageBar = () => {
  const { currentAccount, postMessage, isPostingMessage, calculateTotalFee } =
    useAccountContext();
  const [message, setMessage] = useState("");
  const [customText, setCustomText] = useState("");
  const [gifId, setGifId] = useState("");
  const [messageDuration, setMessageDuration] = useState<number>(1);
  const [openOptionsPanel, setOpenOptionsPanel] = useState(false);
  const [totalCost, setTotalCost] = useState<number>(
    calculateTotalFee(messageDuration, customText, gifId)
  );

  const canPost = currentAccount && !isPostingMessage;

  // const calculateTotalFee = (
  //   messageDuration: number,
  //   customText: string,
  //   gifId: string
  // ) => {
  //   let newCost = FEE;

  //   if (customText !== "") {
  //     newCost += FEE;
  //   }

  //   if (gifId !== "") {
  //     newCost += FEE;
  //   }

  //   if (messageDuration > 1) {
  //     newCost += FEE * (messageDuration - 1);
  //   }

  //   newCost = Number.parseFloat(newCost.toFixed(3));

  //   return newCost;
  // };

  // totalCost = calculateTotalFee(messageDuration, customText, gifId);

  const handleSubmit = () => {
    postMessage(message, messageDuration, customText, gifId);
    setCustomText("");
    setGifId("");
    setMessage("");
    setMessageDuration(1);
  };

  useEffect(() => {
    const totalFee = calculateTotalFee(messageDuration, customText, gifId);
    setTotalCost(totalFee);
  }, [gifId, customText, messageDuration]);

  console.log("rendering message bar");

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
            placeholder={
              canPost ? "Post Message" : "Connect wallet to add message"
            }
            className="message-input"
          />
          {/* TOGGLE OPTIONS PANEL */}
          <button
            className="message-extras-button"
            disabled={!canPost}
            onClick={() => setOpenOptionsPanel((prev) => !prev)}
          >
            <AiOutlineSetting
              color={openOptionsPanel ? "#646cff" : "inherit"}
            />
          </button>

          <div style={{ position: "relative" }}>
            {/* FEE COST */}
            <div
              style={{
                position: "absolute",
                top: !openOptionsPanel ? "-2rem" : "0",
                right: ".5rem",
                color: !openOptionsPanel ? "#646cff" : "transparent",
                transition: "all 0.3s ease-in-out",
                whiteSpace: "nowrap",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <label>Total Cost:</label>
              <FaEthereum fontSize={"1rem"} />
              <span style={{ margin: " 0 .5rem" }}>
                {calculateTotalFee(messageDuration, customText, gifId)}
              </span>
            </div>

            {/* POST MESSAGE */}
            <button
              className="message-post-button"
              onClick={() => handleSubmit()}
              disabled={!canPost}
            >
              <span>{canPost ? "Add Message" : "Connect Wallet"}</span>
              <BsArrowUpRight width="1rem" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBar;
