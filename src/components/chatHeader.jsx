import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "react-router-dom";
import { funcitons } from "../contexts/functionContext";
import { useContext } from "react";
import { useParams } from "react-router-dom";
export default function ChatHeader({ user2Name, isOnline }) {
  const [showToolBar, SetSTB] = useState(false);
  const popupRef = useRef(null);
  const nevigate = useNavigate();
  const {alerts, leaveMember} = useContext(funcitons);
   const { roomId } = useParams();
  const [status, setStatus] = useState("");
   const location = useLocation();

  useEffect(() => {
    console.log("isonline check", isOnline);
    if (isOnline === "group") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus("");
    } else if (isOnline?.status === true) {
      console.log("User is online");
      setStatus("🟢online");
    } else if (isOnline === undefined) {
      console.log("User is offline");
      setStatus("🔴offline");
    }
  }, [isOnline]);
 const handleBack = () => {
  
  if (location.state?.from == "/") {
    nevigate("/");
  } else if (location.state?.from == "/Group") {
    nevigate("/Group");
  } else {
    nevigate(-1);
  }
};

  useEffect(() => {
    function handleClickOutside(e) {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        SetSTB(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDeleteChat = () => {
    if(confirm("Are you sure you want to delete this chat?")) {
      alerts(roomId);
      nevigate("/");
    }
  
  }

  const handleLeaveGroup = () => {
    if(confirm("Are you sure you want to leave this group?")) {
      leaveMember(roomId);
      nevigate("/Group");
    }
  }

  return (
    <div>
      <div className="chatBoxheader">
        <div className="chatBoxContent">
          <ArrowLeft onClick={handleBack} />
          <img
            src="https://cdn-icons-png.flaticon.com/512/4712/4712027.png"
            alt="Logo"
            className="IconImg"
          />
          <div className="chatBoxText">
            <h1>{user2Name}</h1>
            <p>{status}</p>
          </div>
        </div>
        <div className="btContainer">
          {!showToolBar ? (
            <button
              className="moreBt"
              onClick={() => {
                SetSTB(!showToolBar);
              }}
            >
              ⋮
            </button>
          ) : (
            <div
              className={`toolbar ${showToolBar ? "show" : ""}`}
              ref={popupRef}
            >
              {status === "" ? (
                <>
                  <button className="popUpBt" onClick={handleLeaveGroup}>
                    Leave Group
                  </button>
                  <button className="popUpBt">Add Member</button>
                </>
              ) : (
                <>
                <button className="popUpBt" onClick={handleDeleteChat}>Delete Chat</button>
                 <button className="popUpBt">Block</button>
              </>)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
