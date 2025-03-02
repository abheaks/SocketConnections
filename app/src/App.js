import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io("ws://localhost:8080", {
      transports: ["websocket"], // Ensure only WebSocket transport is used
    });

    socketRef.current.on("connect", () => {
      console.log("Connected to WebSocket server");
    });

    socketRef.current.on("connect_error", (error) => {
      console.error("Connection error:", error);
    });

    socketRef.current.on("message", (text) => {
      console.log("Received message:", text);
      setMessages((prevMessages) => [...prevMessages, text]);
    });

    socketRef.current.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const handleSendMessage = () => {
    if (socketRef.current && input.trim() !== "") {
      console.log("Sending message:", input);
      socketRef.current.emit("message", input);
      setInput("");
    }
  };

  return (
    <div className="App">
      <ul>
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
      <input
        type="text"
        placeholder="message"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
}

export default App;
