import ReactDOM from "react-dom/client";
import App from "./App";
import AccountContextProvider from "./context/AccountContextProvider";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <AccountContextProvider>
    <App />
  </AccountContextProvider>
);
