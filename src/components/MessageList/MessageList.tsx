// src/components/MessageList/MessageList.tsx
import { useEffect, useRef } from "react";
import type { Message } from "../../types";
import "./MessageList.scss";
import { Bot, User } from "lucide-react";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

const MessageList = ({ messages, isLoading }: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="message-list">
      {messages.map((msg, index) => {
        // A message is "streaming" if it's the last one, from the bot, and we are still loading the response.
        const isStreaming =
          isLoading && msg.sender === "bot" && index === messages.length - 1;

        return (
          <div key={msg.id} className={`message-bubble ${msg.sender}`}>
            <div className="message-bubble__icon">
              {msg.sender === "bot" ? <Bot size={20} /> : <User size={20} />}
            </div>
            {/* Apply the 'streaming' class conditionally */}
            <div
              className={`message-bubble__text ${
                isStreaming ? "streaming" : ""
              }`}
            >
              {msg.text}
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
