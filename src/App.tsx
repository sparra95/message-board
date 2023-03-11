// @ts-nocheck
import "./styles/general.css";
import "./styles/customText.css";
import Navbar from "./components/Navbar";
import MessageBar from "./components/MessageBar";
import MessageFeed from "./components/MessageFeed";

/**
 * @todo TODO
 * ***** NOTE: don't spend too much time on either the frontend or the smart contract,
 * ***** one thing at a time on each end, then iterate in small steps!
 *
 * TEXT:
 * - BOUNCE: https://codepen.io/alphardex/pen/QWWavvx
 * - NEON?: (City Lights text) https://codepen.io/montyjanderson/pen/nzKGmP
 * - NEON WAVE/SPARKLE: https://codepen.io/comehope/pen/GBwvxw
 * - FLICKERING NEON: https://codepen.io/GeorgePark/pen/MrjbEr
 * -
 *
 * - FRONTEND WEB APP
 * - convert css to tailwindcss, complete typescript types (remove ignore at top of file)
 * - add more text options! separate files for each text option? (https://freefrontend.com/css-3d-text-effects/)
 */

function App() {
  return (
    <div className="App">
      <Navbar />
      <MessageFeed />
      <MessageBar />
    </div>
  );
}

export default App;
