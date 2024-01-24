"use client";

import React, {
  createContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Chat } from "@/modules/chat/core/chat";
import {
  RAMChatGateway,
  User,
} from "@/modules/chat/core/adapters/ram/ram-chat-gateway";
import { Message } from "@/modules/chat/core/model/message";
import { IEventListener } from "@/modules/chat/core/ports/chat-gateway";

type ContextType = {
  messages: Message[];
  controller: Chat;
};

const Context = createContext<ContextType>({
  messages: [],
  controller: null as any,
});

export const ChatRoot: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const chatRef = useRef<Chat>();
  if (!chatRef.current) {
    chatRef.current = new Chat(
      new RAMChatGateway({
        users: [User.create("alice", "alice"), User.create("bob", "bob")],
      }),
    );

    chatRef.current?.login("alice", "alice");
  }

  const [messages, setMessage] = useState<Message[]>();

  useEffect(() => {
    const listener: IEventListener = {
      onNewMessage(message: Message) {
        setMessage((messages) => [...(messages ?? []), message]);
      },
      onMessageDeleted(id: string) {
        setMessage((messages) => messages?.filter((m) => m.id !== id));
      },
    };

    chatRef.current?.addListener(listener);
    return () => {
      chatRef.current?.removeListener(listener);
    };
  });

  const contextValue = useMemo(
    () => ({
      messages: messages ?? [],
      controller: chatRef.current!,
    }),
    [messages],
  );

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};

export const useChat = () => React.useContext(Context);
