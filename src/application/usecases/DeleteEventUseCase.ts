import { EventRepositoryInterface } from "../../domain/interfaces/EventRepositoryInterface";

export class DeleteEventUseCase {
  constructor(private readonly repository: EventRepositoryInterface) {}

  async execute(id: string): Promise<void> {
    if (!id || id.trim() === "") {
      throw new Error("Event id is required");
    }

    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new Error("Event not found");
    }

    await this.repository.delete(id);
  }
}
