import { useEffect, useRef } from "react";
import MessageItem from "./MessageItemTest";
import MessageInput from "./MessageInputTest";

const MessageList = ({ messages, currentUserId, onSend }) => {

  // auto scroll down behavior
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div 
      className=" bg-background rounded-md max-h-150 flex flex-col "
    >
      <div 
      ref={chatRef}
      className="overflow-y-auto p-4 flex-1"
      >
        {messages.length === 0 ? (
          <div className="flex items-center justify-center text-secondary text-sm">
            <p>No messages yet</p>
          </div>
        ) : (
          messages.map((msg) => (
            <MessageItem
              key={msg.id}
              msg={msg}
              currentUserId={currentUserId}
            />
          ))
        )}
      </div>
      <MessageInput
      onSend={onSend}
      />
    </div>
  );
};

export default MessageList;