import { Message } from "@/modules/chat/core/model/message";

export interface IEventListener {
  onNewMessage(message: Message): void;
  onMessageDeleted(id: string): void;
}

export class SendMessageCommand {
  constructor(public readonly content: string) {}
}

export class DeleteMessageCommand {
  constructor(public readonly id: string) {}
}

export class LoginCommand {
  constructor(
    public readonly username: string,
    public readonly password: string,
  ) {}
}

export interface IChatGateway {
  // Commands
  login(command: LoginCommand): Promise<void>;
  logout(): Promise<void>;
  sendMessage(command: SendMessageCommand): Promise<void>;
  deleteMessage(command: DeleteMessageCommand): Promise<void>;

  // Queries
  getMessagesList(): Promise<Message[]>;

  // Events
  addEventListener(listener: IEventListener): void;
  removeEventListener(listener: IEventListener): void;
}
