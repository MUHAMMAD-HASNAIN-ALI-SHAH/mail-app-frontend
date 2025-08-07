import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { MantineProvider } from "@mantine/core";
import '@mantine/core/styles.css';

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <MantineProvider>
        <ToastContainer />
        <App />
      </MantineProvider>
    </BrowserRouter>
  </StrictMode>
);
