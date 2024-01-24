import {
  DeleteMessageCommand,
  IChatGateway,
  IEventListener,
  LoginCommand,
  SendMessageCommand,
} from "@/modules/chat/core/ports/chat-gateway";
import { Message } from "@/modules/chat/core/model/message";
import { nanoid } from "nanoid";
import { Author } from "@/modules/chat/core/model/author";

export class User {
  constructor(
    public readonly id: string,
    public readonly username: string,
    public readonly password: string,
  ) {}

  static create(username: string, password: string) {
    return new User(nanoid(), username, password);
  }
}

export class RAMChatGateway implements IChatGateway {
  private listeners: IEventListener[] = [];
  private messages: Message[] = [];
  private users: User[] = [];
  private currentUser: User | null = null;

  constructor(config?: { users: User[] }) {
    this.users = config?.users ?? [];
  }

  async login(command: LoginCommand): Promise<void> {
    const user = this.users.find((u) => u.username === command.username);
    if (!user || user.password !== command.password) {
      throw new Error("Invalid username or password");
    }

    this.currentUser = user;
  }

  async logout(): Promise<void> {
    this.currentUser = null;
  }

  async sendMessage(command: SendMessageCommand): Promise<void> {
    this.assertUserIsLoggedIn();

    const message = new Message(
      nanoid(),
      command.content,
      new Date(),
      new Author(this.currentUser!.id, this.currentUser!.username),
    );

    this.messages.push(message);
    this.listeners.forEach((l) => l.onNewMessage(message));
  }

  async deleteMessage(command: DeleteMessageCommand): Promise<void> {
    this.assertUserIsLoggedIn();

    const message = this.messages.find((m) => m.id === command.id);
    if (!message) {
      return;
    }

    this.messages = this.messages.filter((m) => m.id !== command.id);
    this.listeners.forEach((l) => l.onMessageDeleted(message.id));
  }

  async getMessagesList(): Promise<Message[]> {
    return this.messages;
  }

  addEventListener(listener: IEventListener) {
    this.listeners.push(listener);
  }

  removeEventListener(listener: IEventListener) {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  getMessagesListSync(): Message[] {
    return this.messages;
  }

  private assertUserIsLoggedIn() {
    if (!this.currentUser) {
      throw new Error("User is not logged in");
    }
  }
}
