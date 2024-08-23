"use client";

import { useState, useEffect, useRef } from "react";
import { WebSocketClient } from "./websocket-client";
import Image from 'next/image';

const Chat = () => {
  const [messages, setMessages] = useState<{ sender: string, message: string }[]>([]);
  const [input, setInput] = useState<string>("");
  const wsClient = useRef<WebSocketClient | null>(null);

  useEffect(() => {
    wsClient.current = new WebSocketClient("ws://localhost:8001");
    wsClient.current.socket.onmessage = (event) => {
      const parsedMessage = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, { sender: 'system', message: parsedMessage.message }]);
    };

    return () => {
      wsClient.current?.socket.close();
    };
  }, []);

  const sendMessage = () => {
    if (wsClient.current) {
      wsClient.current.sendMessage(input);
      setMessages((prevMessages) => [...prevMessages, { sender: 'user', message: input }]);
      setInput("");
    }
  };

  return (
    <div className="chat-container" style={{ backgroundColor: '#2d2d2d', color: '#d1d1d1' }}>
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className="chat-message" style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
            {msg.sender === 'system' ? (
              <Image src="/bot.png" alt="System Avatar" width={40} height={40} style={{ borderRadius: '50%', marginRight: '10px' }} />
            ) : (
              <Image src="/user.png" alt="User Avatar" width={40} height={40} style={{ borderRadius: '50%', marginLeft: '10px' }} />
            )}
            <div style={{ backgroundColor: '#3d3d3d', padding: '10px', borderRadius: '10px', flex: 1 }}>
              {msg.message}
            </div>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="chat-input"
        style={{ backgroundColor: '#3d3d3d', border: '1px solid #4d4d4d', padding: '10px', borderRadius: '10px', marginBottom: '10px', width: 'calc(100% - 22px)' }}
      />
      <button onClick={sendMessage} className="chat-send-button" style={{ backgroundColor: '#1e90ff', color: '#fff', fontWeight: 'bold', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer' }}>
        Send
      </button>
    </div>
  );
};

export default Chat;