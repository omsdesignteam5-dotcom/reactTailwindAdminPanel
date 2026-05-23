import React from "react";
import { Provider } from "react-redux";
import ReactDOM from "react-dom/client";

//CSS
import "./index.css";

//Components
import App from "./App";

//Store
import store from "./store";

//Performance
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(
  <Provider store={store}>
    <App />
  </Provider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
