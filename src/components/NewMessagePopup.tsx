import { useAccountContext } from "../context/AccountContextProvider";
import { AiOutlineArrowDown } from "react-icons/ai";

const NewMessagePopup = () => {
  const { newMessagesAvailable } = useAccountContext();

  if (!newMessagesAvailable) {
    return null;
  }

  const scrollToLastMessage = (e: React.BaseSyntheticEvent) => {
    const lastMessage = document.querySelector(".message-bubble:last-child");

    if (lastMessage) {
      lastMessage.scrollIntoView({ behavior: "smooth" });
      e.target.remove();
    }
  };

  return (
    <button
      className="new-message-alert"
      onClick={(e) => scrollToLastMessage(e)}
    >
      See latest messages <AiOutlineArrowDown />
    </button>
  );
};

export default NewMessagePopup;
