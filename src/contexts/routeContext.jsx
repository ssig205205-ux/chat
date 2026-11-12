import { createContext, useState } from "react";
const routeContext = createContext();

export default function RouteProvider({ children }) {
  const [currentRoute, setCurrentRoute] = useState(false);

  console.log("RouteProvider currentRoute:", currentRoute); // Log the current route

  return (
    <routeContext.Provider value={{ currentRoute, setCurrentRoute }}>
      {children}
    </routeContext.Provider>
  );
}
// eslint-disable-next-line react-refresh/only-export-components
export { routeContext };