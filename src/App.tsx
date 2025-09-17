// src/App.tsx
import { useState, useEffect } from "react";
import ChatScreen from "./components/ChatScreen/ChatScreen";
import { v4 as uuidv4 } from "uuid"; // `npm install uuid @types/uuid`
import type { Message } from "./types";

const App = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Function to get or create a session ID from localStorage
  const getSessionId = (): string => {
    let sessionId = localStorage.getItem("chatSessionId");
    if (!sessionId) {
      sessionId = uuidv4();
      localStorage.setItem("chatSessionId", sessionId);
    }
    return sessionId;
  };

  useEffect(() => {
    getSessionId(); // Ensure session ID is set on initial load
    // You could also load initial messages from a server here if needed
  }, []);

  const handleSendMessage = (text: string) => {
    const userMessage: Message = { id: uuidv4(), text, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // --- DUMMY BOT RESPONSE ---
    // In a real app, you would make an API call here.
    setTimeout(() => {
      const botMessage: Message = {
        id: uuidv4(),
        text: "This is a simulated response. In a real application, this would come from the Gemini API based on the RAG pipeline.",
        sender: "bot",
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);
    }, 1500); // Simulate network delay
  };

  const handleResetSession = () => {
    setMessages([]); // Clear messages from the UI
    localStorage.removeItem("chatSessionId"); // Clear old session ID
    getSessionId(); // Generate and store a new one
  };

  return (
    <ChatScreen
      messages={messages}
      isLoading={isLoading}
      onSendMessage={handleSendMessage}
      onResetSession={handleResetSession}
    />
  );
};

export default App;
