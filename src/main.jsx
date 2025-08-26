import React from "react";
import ReactDOM from "react-dom/client";
import Popup from "./Popup";

const rootElement = document.getElementById("root");

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(<Popup />);
} else {
  console.error("Root element not found in popup.html");
}
