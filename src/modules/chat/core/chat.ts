import {
  DeleteMessageCommand,
  IChatGateway,
  IEventListener,
  LoginCommand,
  SendMessageCommand,
} from "@/modules/chat/core/ports/chat-gateway";

export class Chat {
  constructor(private readonly gateway: IChatGateway) {}

  async login(username: string, password: string) {
    await this.gateway.login(new LoginCommand(username, password));
  }

  async logout() {
    await this.gateway.logout();
  }

  async send(content: string) {
    await this.gateway.sendMessage(new SendMessageCommand(content));
  }

  async delete(id: string) {
    await this.gateway.deleteMessage(new DeleteMessageCommand(id));
  }

  addListener(listener: IEventListener) {
    this.gateway.addEventListener(listener);
  }

  removeListener(listener: IEventListener) {
    this.gateway.removeEventListener(listener);
  }
}
