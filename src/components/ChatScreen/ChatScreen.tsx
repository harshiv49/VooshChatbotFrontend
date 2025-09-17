// src/components/ChatScreen/ChatScreen.tsx
import type { Message } from "../../types";
import MessageList from "../MessageList/MessageList";
import MessageInput from "../MessageInput/MessageInput";
import ResetButton from "../ResetButton/ResetButton";
import "./ChatScreen.scss";
import { Bot } from "lucide-react";

interface ChatScreenProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (text: string) => void;
  onResetSession: () => void;
}

const ChatScreen = ({
  messages,
  isLoading,
  onSendMessage,
  onResetSession,
}: ChatScreenProps) => {
  return (
    <div className="chat-screen">
      <header className="chat-screen__header">
        <div className="chat-screen__header-info">
          {" "}
          {/* Added a wrapper div */}
          <div className="chat-screen__header-icon">
            <Bot size={24} />
          </div>
          <div className="chat-screen__header-text">
            <h2>Voosh AI Assistant</h2>
            <p>Online</p>
          </div>
        </div>
        <ResetButton onReset={onResetSession} />{" "}
      </header>
      <MessageList messages={messages} isLoading={isLoading} />
      <MessageInput onSendMessage={onSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default ChatScreen;
