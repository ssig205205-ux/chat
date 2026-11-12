import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";

const tabs = [
  { icon: "🏠", label: "Chats", route: "/" },
  { icon: "💬", label: "Groups", route: "/Group" },
  
  { icon: "👤", label: "Profile", route: "/Profile" },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const active = tabs.findIndex(
    (tab) => tab.route === location.pathname
  );

  return (
    <div className="nav">
      {tabs.map((tab, index) => (
        <button
          key={tab.route}
          className="tab"
          onClick={() => navigate(tab.route)}
        >
          {active === index && (
            <motion.div
              layoutId="active-pill"
              className="active-pill"
              transition={{
                type: "spring",
                stiffness: 450,
                damping: 30,
              }}
            />
          )}

          <motion.div
            animate={{
              y: active === index ? -8 : 0,
              scale: active === index ? 1.15 : 1,
            }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 20,
            }}
            className="content"
          >
            <span className="icon">{tab.icon}</span>
            <span>{tab.label}</span>
          </motion.div>
        </button>
      ))}
    </div>
  );
}