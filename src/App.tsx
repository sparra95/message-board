import "./styles/general.css";
import "./styles/customText.css";
import Navbar from "./components/Navbar";
import MessageBar from "./components/MessageBar";
import MessageFeed from "./components/MessageFeed";
import NewMessagePopup from "./components/NewMessagePopup";
import { useAccountContext } from "./context/AccountContextProvider";

function App() {
  const { messageNodes } = useAccountContext();
  console.log("rendering app");

  return (
    <div className="App">
      <Navbar />
      <MessageFeed messageNodes={messageNodes} />
      <MessageBar />
      <NewMessagePopup />
    </div>
  );
}

export default App;
