import { useAccountContext } from "../context/AccountContextProvider";
import MessageBubble from "./MessageBubble";

const MessageFeed = () => {
  const { messageNodes } = useAccountContext();

  return (
    <div className="message-feed">
      {messageNodes.map((node) => (
        <MessageBubble key={JSON.stringify(node)} messageNode={node} />
      ))}
    </div>
  );
};

export default MessageFeed;
