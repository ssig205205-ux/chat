import ChatHeader from "./components/chatHeader";
import MsgSender from "./components/msgSender";
import MsgPart from "./components/msgPart";
import { useParams } from "react-router-dom";
import { useEffect, useState, useContext, useRef } from "react";
import { AuthContext } from "./contexts/authContext";
import { userOnline } from "./contexts/onlineContext";
import { socket } from "./socket";

export default function ChatPages() {
  const { user2Name, roomId, otherUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const { user } = useContext(AuthContext);
  const { onlineUser } = useContext(userOnline);
  const [messageData, setMessageData] = useState("");

  const id = user?.user?._id;
  console.log("ChatPages user ID:", id);

  const containerRef = useRef(null);

  // Fetch messages and join room
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/getMessages/${roomId}`,
          {
            credentials: "include",
          },
        );

        const data = await response.json();
        console.log("Fetched messages:", data);
        setMessages(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMessages();

    // Join the room
    socket.emit("joinRoom", roomId);

    const handleReceiveMessage = (data) => {
      console.log("Received:", data);

      // Ignore messages from other rooms (optional but recommended)
      if (data.roomId !== roomId) return;

      setMessages((prev) => [...prev, data]);
    };

    socket.on("receive-message", handleReceiveMessage);

    return () => {
      socket.off("receive-message", handleReceiveMessage);

      // If your server supports leaving rooms
      socket.emit("leaveRoom", roomId);
    };
  }, [roomId]);

  useEffect(() => {
    console.log({
      messageData,
      id,
      roomId,
    });

    socket.emit("send-message", {
      roomId: roomId,
      senderId: id,
      message: messageData,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messageData]);

  // Auto scroll
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  console.log(typeof(otherUserId), "otherUserid");
 
  const [state,setState] = useState(null)

  useEffect(() => {
    
    if (otherUserId==="undefined") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState("group")
    } else {
      const isOnline = onlineUser.find((e) => e.userID === otherUserId);
      setState(isOnline)
    }
    
  },[otherUserId, onlineUser]);

  return (
    <div className="chatBoxBackground">
      <ChatHeader user2Name={user2Name} isOnline={state} />

      <div className="msgContainer" ref={containerRef}>
        <div className="msgList">
          {messages.map((msg, index) => (
            <MsgPart
              key={msg._id || index}
              sender={msg.senderId}
              message={msg.massage}
            />
          ))}
        </div>
      </div>

      <MsgSender setMessageData={setMessageData} />
    </div>
  );
}
