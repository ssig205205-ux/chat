import { useState, createContext } from "react";

const QrResult = createContext();

export default function QrContextProvider({ children }) {
  const [result, setResult] = useState("");

  return (
    <QrResult.Provider value={{ result, setResult }}>
      {children}
    </QrResult.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export { QrResult };
