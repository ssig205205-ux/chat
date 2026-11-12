import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useContext } from "react";
import { routeContext } from "../contexts/routeContext";

export default function RouteTracker() {
  const location = useLocation();
  const { setCurrentRoute } = useContext(routeContext);

  useEffect(() => {
    if (
      location.pathname === "/" ||
      location.pathname === "/Group" ||
      location.pathname === "/Profile"
    ) {
      console.log("Route changed:", location.pathname);
      setCurrentRoute(true);
    } else {
      setCurrentRoute(false);
    }
  }, [location.pathname, setCurrentRoute]);

  return null;
}
