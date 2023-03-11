import { useAccountContext } from "../context/AccountContextProvider";
import { useState } from "react";
import { Carousel, Gif } from "@giphy/react-components";
import BasicText from "./BasicText";
import NeonText from "./NeonText";
import ElectricText from "./ElectricText";

type Props = {
  isOpen: boolean;
  totalCost: number;
  gifId: string;
  setGifId: (id: string) => void;
  customText: string;
  setCustomText: (text: string) => void;
  messageDuration: number;
  setMessageDuration: (duration: number) => void;
};

const MessageOptions = ({
  isOpen,
  totalCost,
  gifId,
  setGifId,
  customText,
  setCustomText,
  messageDuration,
  setMessageDuration,
}: Props) => {
  const { GF } = useAccountContext();
  const [gifSearchTerm, setGifSearchTerm] = useState<string>("");
  const [gif, setGif] = useState<any>(null);

  const fetchGifs = gifSearchTerm
    ? (offset: number) => GF.search(gifSearchTerm, { offset, limit: 10 })
    : (offset: number) => GF.trending({ offset, limit: 10 });

  return (
    <div
      className="options-panel"
      style={{
        height: isOpen ? "320px" : "0",
        padding: isOpen ? "1rem 1rem" : "0 1rem",
        overflowY: isOpen ? "scroll" : "hidden",
        opacity: isOpen ? "1" : "0",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label>Extend Message Duration</label>
        <input
          type="number"
          step={1}
          min="1"
          max="90"
          value={messageDuration}
          onChange={(e) => setMessageDuration(Number(e.target.value))}
          style={{ width: "250px", padding: ".5rem 1rem" }}
        />
      </div>
      <div
        style={{ display: "flex", flexDirection: "column", rowGap: ".5rem" }}
      >
        <label>Custom Text</label>
        <div style={{ display: "flex", columnGap: ".5rem" }}>
          <button
            className={`bg-black ${customText === "" ? "button-active" : ""}`}
            onClick={() => setCustomText("")}
          >
            <BasicText message="Basic text" />
          </button>
          <button
            className={`bg-black ${
              customText === "NEON" ? "button-active" : ""
            }`}
            onClick={() => setCustomText("NEON")}
          >
            <NeonText message="Neon text" />
          </button>
          <button
            className={`bg-black ${
              customText === "ELECTRIC" ? "button-active" : ""
            }`}
            onClick={() => setCustomText("ELECTRIC")}
          >
            <ElectricText message="Electric text" />
          </button>
        </div>
      </div>
      <div
        style={{ display: "flex", flexDirection: "column", rowGap: ".5rem" }}
      >
        <label>Add a Gif</label>
        <div>
          <input
            type="text"
            style={{
              width: "250px",
              padding: ".5rem 1rem",
              marginRight: ".5rem",
            }}
            placeholder={"Search"}
            value={gifSearchTerm}
            onChange={(e) => setGifSearchTerm(e.target.value)}
          />
          {gifId && (
            <button
              className="ghost-btn"
              onClick={() => {
                setGifId("");
                setGif(null);
              }}
            >
              Clear Gif
            </button>
          )}
        </div>
        {gifId ? (
          <Gif gif={gif} width={100} />
        ) : (
          <Carousel
            gifHeight={100}
            fetchGifs={fetchGifs}
            key={gifSearchTerm}
            noLink
            hideAttribution
            onGifClick={(gif, e) => {
              setGifId(String(gif.id));
              setGif(gif);
            }}
          />
        )}
      </div>
      <div className="total-cost">
        <label>Total Cost</label>
        <span style={{ margin: " 0 .5rem" }}>{totalCost}</span>
      </div>
    </div>
  );
};

export default MessageOptions;
