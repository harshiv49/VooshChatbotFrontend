// src/App.tsx
import { useState, useEffect } from "react";
import ChatScreen from "./components/ChatScreen/ChatScreen";
import type { Message } from "./types";
import { v4 as uuidv4 } from "uuid";

// Define the base URL of your backend API
const API_BASE_URL = "https://vooshchatbotbackend.onrender.com";

const App = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(false); // <-- NEW state for system status

  // Effect to initialize session, check health, and load history
  useEffect(() => {
    const initializeApp = async () => {
      // 1. Check system health first
      try {
        const healthResponse = await fetch(`${API_BASE_URL}/health`);
        const healthData = await healthResponse.json();
        if (
          healthData &&
          healthData.features &&
          healthData.features.ragAvailable
        ) {
          setIsOnline(true);
        } else {
          setIsOnline(false);
        }
      } catch (error) {
        console.error("Health check failed:", error);
        setIsOnline(false);
      }

      // 2. Initialize the session
      let currentSessionId = localStorage.getItem("chatSessionId");
      if (!currentSessionId) {
        try {
          const sessionResponse = await fetch(`${API_BASE_URL}/session/new`, {
            method: "POST",
          });
          const sessionData = await sessionResponse.json();
          currentSessionId = sessionData.sessionId;
          localStorage.setItem("chatSessionId", currentSessionId!);
        } catch (error) {
          console.error(
            "Failed to create a new session, using local fallback:",
            error
          );
          currentSessionId = uuidv4();
          localStorage.setItem("chatSessionId", currentSessionId);
        }
      }
      setSessionId(currentSessionId);

      // 3. Fetch history for the session
      try {
        const historyResponse = await fetch(
          `${API_BASE_URL}/session/${currentSessionId}/history`
        );
        if (historyResponse.ok) {
          const historyData = await historyResponse.json();
          const formattedHistory = historyData.history.map((msg: any) => ({
            id: uuidv4(),
            text: msg.content,
            sender: msg.role === "user" ? "user" : "bot",
          }));
          setMessages(formattedHistory);
        }
      } catch (error) {
        console.error("Failed to fetch session history:", error);
      }
    };

    initializeApp();
  }, []);

  const handleSendMessage = async (text: string) => {
    if (!sessionId || isLoading) return;

    // 1. Add user message to UI
    const userMessage: Message = { id: uuidv4(), text, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // 2. Add an empty placeholder for the bot's streaming response
    const botMessageId = uuidv4();
    const placeholderMessage: Message = {
      id: botMessageId,
      text: "",
      sender: "bot",
    };
    setMessages((prev) => [...prev, placeholderMessage]);

    try {
      // 3. Call the streaming endpoint
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: text, sessionId }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Failed to get streaming response.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      // 4. Read the stream chunk by chunk
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.substring(6);
            if (data.includes("[DONE]")) break;

            try {
              const { token } = JSON.parse(data);
              // 5. Append each token to the placeholder message
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === botMessageId
                    ? { ...msg, text: msg.text + token }
                    : msg
                )
              );
            } catch (error) {
              // This can happen with incomplete JSON chunks, safely ignore
            }
          }
        }
      }
    } catch (error) {
      console.error("Failed to stream message:", error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botMessageId
            ? {
                ...msg,
                text: "Sorry, an error occurred while streaming the response.",
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSession = async () => {
    // ... (This function remains exactly the same)
    if (!sessionId) return;
    try {
      await fetch(`${API_BASE_URL}/session/${sessionId}`, { method: "DELETE" });
    } catch (error) {
      console.error("Failed to clear session on server:", error);
    } finally {
      setMessages([]);
      localStorage.removeItem("chatSessionId");
      setSessionId(null);
    }
  };

  // Re-run initialization if session ID becomes null (after reset)
  useEffect(() => {
    // ... (This function remains exactly the same)
    if (!sessionId) {
      const reinitialize = async () => {
        const response = await fetch(`${API_BASE_URL}/session/new`, {
          method: "POST",
        });
        const data = await response.json();
        const newSessionId = data.sessionId;
        localStorage.setItem("chatSessionId", newSessionId);
        setSessionId(newSessionId);
      };
      reinitialize();
    }
  }, [sessionId]);

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

// const handleSendMessage = async (text: string) => {
//   // ... (This function remains exactly the same)
//   if (!sessionId) return;
//   const userMessage: Message = { id: uuidv4(), text, sender: "user" };
//   setMessages((prev) => [...prev, userMessage]);
//   setIsLoading(true);
//   try {
//     const response = await fetch(`${API_BASE_URL}/chat`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ query: text, sessionId: sessionId }),
//     });
//     if (!response.ok) {
//       throw new Error(`API error: ${response.statusText}`);
//     }
//     const data = await response.json();
//     const botMessage: Message = {
//       id: uuidv4(),
//       text: data.response,
//       sender: "bot",
//       sources: data.sources,
//     };
//     setMessages((prev) => [...prev, botMessage]);
//   } catch (error) {
//     console.error("Failed to send message:", error);
//     const errorMessage: Message = {
//       id: uuidv4(),
//       text: "Sorry, I couldn't connect to the server. Please try again later.",
//       sender: "bot",
//     };
//     setMessages((prev) => [...prev, errorMessage]);
//   } finally {
//     setIsLoading(false);
//   }
// };
