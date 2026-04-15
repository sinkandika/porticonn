const MessageItem = ({ msg, currentUserId }) => {
  const isMe = msg.senderId === currentUserId; // if senderId and user id same 

  // message time
  let time = "";

  if (msg.createdAt && typeof msg.createdAt.toDate === "function") {
    time = msg.createdAt.toDate().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className={`mb-2 flex ${isMe ? "justify-end" : "justify-start"}`}
    >
      <div className="max-w-[70%]">
        {/* Show name only for others */}
        {!isMe && (
          <p className="text-xs text-secondary mb-1">
            {msg.senderName}
          </p>
        )}

        <div
          className={`px-3 py-2 rounded-md ${
            isMe
              ? "bg-third text-white"
              : "bg-gray-200 text-black"
          }`}
        >
          <p>{msg.text}</p>

          {time && (
            <p className="text-[10px] opacity-70 mt-1 text-right">
              {time}
            </p>
          )}
        </div>

      </div>
    </div>
  );
};

export default MessageItem;