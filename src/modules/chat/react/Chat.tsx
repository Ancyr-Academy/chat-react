"use client";

import React from "react";
import { useChat } from "@/modules/chat/react/ChatRoot";
import { Button, FormControl, Input, Stack, Typography } from "@mui/material";
import styled from "@emotion/styled";
import { format } from "date-fns";
import { Message } from "@/modules/chat/core/model/message";

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

  // I Can fetch messages using react-query by passing a method call to `controller.getMessages`
  // In React Query
  return (
    <div>
      <header>
        <Typography variant={"h3"}>List of messages</Typography>
        <Messages>
          {messages.map((m) => (
            <MessageRow key={m.id}>{m}</MessageRow>
          ))}
        </Messages>
      </header>
      <form onSubmit={sendMessage}>
        <FormControl>
          <Stack direction={"row"}>
            <Input type="text" name={"message"} />
            <Button type="submit">Send</Button>
          </Stack>
        </FormControl>
      </form>
    </div>
  );
};

const MessageRow: React.FC<{ children: Message }> = ({ children }) => {
  return (
    <Typography mt={1} mb={1}>
      <b>
        {children.author.name} {format(children.createdAt, "HH:mm:ss")}
      </b>{" "}
      : {children.content}
    </Typography>
  );
};

const Messages = styled.div`
  max-height: 500px;
  max-width: 800px;

  overflow-y: auto;

  margin-block: 20px;
`;
