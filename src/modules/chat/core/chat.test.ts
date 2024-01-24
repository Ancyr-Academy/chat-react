import { Chat } from "@/modules/chat/core/chat";
import {
  RAMChatGateway,
  User,
} from "@/modules/chat/core/adapters/ram/ram-chat-gateway";

describe("Sending messages", () => {
  it("should send a message", async () => {
    const gateway = new RAMChatGateway({
      users: [User.create("alice", "password")],
    });

    const chat = new Chat(gateway);
    await chat.login("alice", "password");
    await chat.send("Hello World!");
  });
});
