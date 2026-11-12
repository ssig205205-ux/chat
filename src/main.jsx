import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import AuthProvider from "./contexts/authContext";
import OnlineUserProvider from "./contexts/onlineContext.jsx";
import QrContextProvider from "./contexts/qrContext.jsx";
import App from "./App.jsx";
import RouteProvider from "./contexts/routeContext";
import FContext from "./contexts/functionContext.jsx";
import "./App.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <OnlineUserProvider>
        <RouteProvider>
          <QrContextProvider>
            <FContext>
              <App />
            </FContext>
          </QrContextProvider>
        </RouteProvider>
      </OnlineUserProvider>
    </AuthProvider>
  </StrictMode>,
);
