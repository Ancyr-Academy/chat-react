import { RAMChatGateway } from "@/modules/chat/core/adapters/ram/ram-chat-gateway";
import { Message } from "@/modules/chat/core/model/message";
import { nanoid } from "nanoid";
import { Author } from "@/modules/chat/core/model/author";

export class ActivitySimulator {
  private interval: NodeJS.Timeout | null = null;

  constructor(private readonly gateway: RAMChatGateway) {}

  start() {
    this.interval = setInterval(() => this.run(), 10000);
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  private async run() {
    const joke = await fetch("https://api.chucknorris.io/jokes/random").then(
      (r) => r.json(),
    );

    const message = new Message(
      nanoid(),
      joke.value,
      new Date(),
      new Author("bot", "Bot"),
    );

    this.gateway.addMessage(message);
  }
}
