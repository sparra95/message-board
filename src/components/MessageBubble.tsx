import { useState } from "react";
import {
  MessageNode,
  useAccountContext,
} from "../context/AccountContextProvider";
import NeonText from "./NeonText";
import ElectricText from "./ElectricText";
import { GifResult } from "@giphy/js-fetch-api";
import { Gif } from "@giphy/react-components";
import BasicText from "./BasicText";

type Props = {
  messageNode: MessageNode;
};

const Text = ({ messageNode }: { messageNode: MessageNode }) => {
  switch (messageNode.customText) {
    case "NEON":
      return <NeonText message={messageNode.message} />;
    case "ELECTRIC":
      return <ElectricText message={messageNode.message} />;
    default:
      return <BasicText message={messageNode.message} />;
  }
};

const MessageBubble = ({ messageNode }: Props) => {
  const { GF } = useAccountContext();
  const [myGif, setMyGif] = useState<GifResult["data"] | undefined>(undefined);

  const fetchGif = async (id: string) => {
    try {
      const { data } = await GF.gif(id);
      setMyGif(data);
    } catch (error) {
      console.error(error);
    }
  };

  if (messageNode.gif) {
    fetchGif(messageNode.gif);
  }

  return (
    <div className="message-bubble">
      {myGif && <Gif gif={myGif} width={300} />}
      <Text messageNode={messageNode} />
    </div>
  );
};

export default MessageBubble;
