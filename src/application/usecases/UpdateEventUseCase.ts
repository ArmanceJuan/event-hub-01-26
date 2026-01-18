import { Event } from "../../domain/entities/Event";
import { EventRepositoryInterface } from "../../domain/interfaces/EventRepositoryInterface";

export interface UpdateEventInput {
  title: string;
  description?: string;
  startDate: Date;
  venueId: string;
  capacity: number;
  price?: number;
  organizerId: string;
  categoryId: string;
  imageUrl?: string;
}

export class UpdateEventUseCase {
  constructor(private readonly repository: EventRepositoryInterface) {}

  async execute(id: string, input: UpdateEventInput): Promise<Event> {
    if (!id || id.trim() === "") {
      throw new Error("Event id is required");
    }

    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new Error("Event not found");
    }

    const updated = new Event({
      id,
      title: input.title,
      description: input.description,
      startDate: input.startDate,
      venueId: input.venueId,
      capacity: input.capacity,
      price: input.price,
      organizerId: input.organizerId,
      categoryId: input.categoryId,
      imageUrl: input.imageUrl,
      createdAt: existing.createdAt,
      updatedAt: new Date(),
    });

    return this.repository.update(updated);
  }
}
