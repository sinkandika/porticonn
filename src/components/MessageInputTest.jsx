import { useState } from "react";
import SendIcon from "../assets/send-icon.svg";

const MessageInput = ({ onSend }) => {
  const [message, setMessage] = useState("");

  // send message
  const handleSend = () => {
    if (!message.trim()) return;

    onSend(message);
    setMessage("");
  };

  const handleKeyDown = (e) => {
    // enter = send
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="relative flex items-center font-medium text-primary p-2">
      <button
        onClick={handleSend}
        className="bg-primary hover:bg-primary-h text-white p-3 rounded-md absolute right-4 "
      >
        <img
        src={SendIcon}
        alt="snd"
        className="w-5"
        />
      </button>
      <textarea
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
          /*e.target.style.height = "auto";
          e.target.style.height = e.target.scrollHeight + "px";*/
        }}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        rows={1}
        className="rounded-md px-3 py-2 resize-none bg-white w-full min-h-15 pr-11 text-left outline-none"
      />
    </div>
  );
};

export default MessageInput;