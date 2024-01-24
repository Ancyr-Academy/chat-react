"use client";

import React from "react";
import { useChat } from "@/modules/chat/react/ChatRoot";

export const Chat: React.FC<{}> = ({}) => {
  async function sendMessage(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const message = e.currentTarget.elements.namedItem(
      "message",
    ) as HTMLInputElement;
    if (!message) return;

    const content = message.value;
    message.value = "";

    await controller.send(content);
  }

  const { messages, controller } = useChat();

  return (
    <div>
      <header>
        <h1>List of messages</h1>
        {messages.map((m) => (
          <div key={m.id}>
            {m.author.name} : {m.content}
          </div>
        ))}
      </header>
      <footer>
        <form onSubmit={sendMessage}>
          <input type="text" name={"message"} />
          <button type="submit">Send</button>
        </form>
      </footer>
    </div>
  );
};
