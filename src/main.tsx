import React from "react";
import { Provider } from "react-redux";
import ReactDOM from "react-dom/client";

import "src/index.css";
import App from "src/App";
import store from "src/store";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);
