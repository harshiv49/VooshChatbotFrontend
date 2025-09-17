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
      {messages.map((msg) => (
        <div key={msg.id} className={`message-bubble ${msg.sender}`}>
          <div className="message-bubble__icon">
            {msg.sender === "bot" ? <Bot size={20} /> : <User size={20} />}
          </div>
          <div className="message-bubble__text">{msg.text}</div>
        </div>
      ))}
      {isLoading && (
        <div className="message-bubble bot">
          <div className="message-bubble__icon">
            <Bot size={20} />
          </div>
          <div className="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
