import { Author } from "@/modules/chat/core/model/author";

export class Message {
  constructor(
    public readonly id: string,
    public readonly content: string,
    public readonly createdAt: Date,
    public readonly author: Author,
  ) {}
}
