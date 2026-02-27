import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/store";
import App from "./components/App";
import { Spin } from "antd";
import "antd/dist/reset.css";
import './index.css'

ReactDOM.createRoot(document.getElementById("root")).render(
    <Provider store={store}>
      <PersistGate loading={<Spin fullscreen />} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
);