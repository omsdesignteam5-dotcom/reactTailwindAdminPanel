import React from "react";
import { Provider } from "react-redux";
import ReactDOM from "react-dom/client";

//CSS
import "src/index.css";

//Components
import App from "src/App";

//Store
import store from "src/store";

//Performance
import reportWebVitals from "src/reportWebVitals";

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
