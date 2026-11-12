import { useState, useRef, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { funcitons } from "../contexts/functionContext";
import { Pin } from "lucide-react";

export default function ChatBox({
  roomName,
  text,
  roomId,
  status,
  otherUserId,
  setReFetch2,
  pinned,
}) {
  const [showToolBar, SetSTB] = useState(false);

  const popupRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const { alerts, leaveMember, save2LocalStorage, removeLocalStorage } =
    useContext(funcitons);

  // Check whether this is a normal chat or group
  const isChat = location.pathname === "/";

  const handleClick = (e) => {
    e.preventDefault();

    const route = location.pathname;

    let route2;

    if (route === "/") {
      route2 = "/";
    } else if (route === "/Group") {
      route2 = "/Group";
    } else {
      route2 = "/Group";
    }

    navigate(`/chatPages/${roomName}/${roomId}/${otherUserId}`, {
      state: {
        from: route2,
      },
    });
  };

  // Close toolbar when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        SetSTB(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Delete normal chat
  const handleDeleteChat = () => {
    if (confirm("Are you sure you want to delete this chat?")) {
      alerts(roomId);
      SetSTB(false);
    }
  };

  // Leave group
  const handleLeaveGroup = () => {
    if (confirm("Are you sure you want to leave this group?")) {
      leaveMember(roomId);
      SetSTB(false);
    }
  };

  return (
    <div className="chatBox" onClick={handleClick}>
      <div className="chatBoxContent">
        <div className="imgOnline">
          <img
            src="https://cdn-icons-png.flaticon.com/512/4712/4712027.png"
            alt="Logo"
            className="IconImg"
          />

          <div className={`onlineStatus ${status}`}></div>
        </div>

        <div className="chatBoxText">
          <h1>{roomName}</h1>
          <p>{text}</p>
        </div>
      </div>

      <div className="btContainer">
        {!showToolBar ? (
          <button
            className="moreBt"
            onClick={(e) => {
              e.stopPropagation();
              SetSTB(!showToolBar);
            }}
          >
            ⋮
          </button>
        ) : isChat ? (
          // Normal chat toolbar
          <div
            className={`toolbar ${showToolBar ? "show" : ""}`}
            ref={popupRef}
            onClick={(e) => e.stopPropagation()}
          >
            {pinned === "pinned" ? (
              <button
                className="popUpBt"
                onClick={() => {
                  removeLocalStorage("pinnedRoom", roomId);
                  setReFetch2((prev) => prev + 1);
                  SetSTB(false);
                }}
              >
                Unpin
              </button>
            ) : (
              <button
                className="popUpBt"
                onClick={() => {
                  save2LocalStorage("pinnedRoom", roomId);
                  setReFetch2((prev) => prev + 1);
                  SetSTB(false);
                }}
              >
                Pin to top
              </button>
            )}

            <button className="popUpBt" onClick={handleDeleteChat}>
              Delete Chat
            </button>

            <button className="popUpBt">Block</button>
          </div>
        ) : (
          // Group toolbar
          <div
            className={`toolbar ${showToolBar ? "show" : ""}`}
            ref={popupRef}
            onClick={(e) => e.stopPropagation()}
          >
            {pinned === "pinned" ? (
              <button
                className="popUpBt"
                onClick={() => {
                  removeLocalStorage("pinnedGroup", roomId);
                  setReFetch2((prev) => prev + 1);
                  SetSTB(false);
                }}
              >
                Unpin
              </button>
            ) : (
              <button
                className="popUpBt"
                onClick={() => {
                  save2LocalStorage("pinnedGroup", roomId);
                  setReFetch2((prev) => prev + 1);
                  SetSTB(false);
                }}
              >
                Pin to top
              </button>
            )}
            <button className="popUpBt" onClick={handleLeaveGroup}>
              Leave Group
            </button>
          </div>
        )}
      </div>

      {pinned === "pinned" && (
        <Pin
          className="pin"
          style={{ display: showToolBar ? "none" : "block" }}
        />
      )}
    </div>
  );
}
