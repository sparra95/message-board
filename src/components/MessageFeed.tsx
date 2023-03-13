import MessageBubble from "./MessageBubble";
import { MessageNode } from "../context/AccountContextProvider";
import { memo } from "react";

type Props = {
  messageNodes: MessageNode[];
};

const MessageFeed = ({ messageNodes }: Props) => {
  return (
    <div className="message-feed">
      {messageNodes.map((node) => (
        <MessageBubble key={JSON.stringify(node)} messageNode={node} />
      ))}
    </div>
  );
};

export default memo(MessageFeed);
