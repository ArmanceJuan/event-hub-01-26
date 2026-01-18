import { Event } from "../entities/Event";

export interface EventRepositoryInterface {
  save(event: Event): Promise<Event>;
  findAll(): Promise<Event[]>;
  findById(id: string): Promise<Event | null>;
  update(event: Event): Promise<Event>;
  delete(id: string): Promise<void>;
}
