import { UpdateEventUseCase } from "../../application/usecases/UpdateEventUseCase";
import { InMemoryEventRepository } from "../../infrastructure/repositories/InMemoryEventRepository";
import { Event } from "../../domain/entities/Event";

describe("UpdateEventUseCase (PUT)", () => {
  let repository: InMemoryEventRepository;
  let useCase: UpdateEventUseCase;

  const futureDate = () => new Date(Date.now() + 86400000);

  beforeEach(() => {
    repository = new InMemoryEventRepository();
    useCase = new UpdateEventUseCase(repository);
  });

  it("met à jour un event existant avec des données valides", async () => {
    const existing = new Event({
      id: "evt-1",
      title: "Old title",
      description: "Old desc",
      startDate: futureDate(),
      venueId: "venue-1",
      capacity: 10,
      price: 20,
      organizerId: "user-1",
      categoryId: "cat-1",
      imageUrl: "https://example.com/old.jpg",
    });

    await repository.save(existing);

    const updated = await useCase.execute("evt-1", {
      title: "New title",
      description: "New desc",
      startDate: futureDate(),
      venueId: "venue-2",
      capacity: 50,
      price: 0,
      organizerId: "user-1",
      categoryId: "cat-2",
      imageUrl: "https://example.com/new.jpg",
    });

    expect(updated.id).toBe("evt-1");
    expect(updated.title).toBe("New title");
    expect(updated.venueId).toBe("venue-2");
    expect(updated.capacity).toBe(50);
  });

  it("échoue si l'id est vide", async () => {
    await expect(
      useCase.execute("", {
        title: "X",
        description: "X",
        startDate: futureDate(),
        venueId: "venue-1",
        capacity: 1,
        price: 0,
        organizerId: "user-1",
        categoryId: "cat-1",
        imageUrl: "x",
      })
    ).rejects.toThrow("Event id is required");
  });

  it("échoue si l'event n'existe pas", async () => {
    await expect(
      useCase.execute("unknown", {
        title: "X",
        description: "X",
        startDate: futureDate(),
        venueId: "venue-1",
        capacity: 1,
        price: 0,
        organizerId: "user-1",
        categoryId: "cat-1",
        imageUrl: "x",
      })
    ).rejects.toThrow("Event not found");
  });

  it("échoue si la date est dans le passé", async () => {
    const existing = new Event({
      id: "evt-1",
      title: "Old title",
      description: "Old desc",
      startDate: futureDate(),
      venueId: "venue-1",
      capacity: 10,
      price: 20,
      organizerId: "user-1",
      categoryId: "cat-1",
      imageUrl: "x",
    });

    await repository.save(existing);

    await expect(
      useCase.execute("evt-1", {
        title: "New title",
        description: "New desc",
        startDate: new Date(Date.now() - 86400000),
        venueId: "venue-2",
        capacity: 50,
        price: 0,
        organizerId: "user-1",
        categoryId: "cat-2",
        imageUrl: "x",
      })
    ).rejects.toThrow();
  });
});
