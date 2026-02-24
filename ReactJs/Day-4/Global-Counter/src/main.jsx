import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./Redux/store";
import App from "./components/App";
import "antd/dist/reset.css";
import "./styles/index.css";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>
);