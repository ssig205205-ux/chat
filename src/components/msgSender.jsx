import { Send } from "lucide-react";
import { useState } from "react";

export default function MsgSender({ setMessageData }) {
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setMsg(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (msg === "") {
      console.log("msg is required");
      return;
    }
    setMessageData(msg);
    setMsg("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (msg === "") {
        console.log("msg is required");
        return;
      }
      setMessageData(msg);
      setMsg("");
    }
  };

  return (
    <div className="msgSenderContainer">
      <form onSubmit={handleSubmit} className="sendForm">
        <textarea
          rows="1"
          className="msgInput"
          placeholder="Message"
          onChange={handleChange}
          value={msg}
          onKeyDown={handleKeyDown}
        />
        <button className="sendBt">
          <Send />
        </button>
      </form>
    </div>
  );
}
