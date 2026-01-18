import { DeleteEventUseCase } from "../../application/usecases/DeleteEventUseCase";
import { InMemoryEventRepository } from "../../infrastructure/repositories/InMemoryEventRepository";
import { Event } from "../../domain/entities/Event";

describe("DeleteEventUseCase", () => {
  let repository: InMemoryEventRepository;
  let useCase: DeleteEventUseCase;

  const futureDate = () => new Date(Date.now() + 86400000);

  beforeEach(() => {
    repository = new InMemoryEventRepository();
    useCase = new DeleteEventUseCase(repository);
  });

  it("supprime un event existant", async () => {
    const event = new Event({
      id: "evt-1",
      title: "To delete",
      description: "desc",
      startDate: futureDate(),
      venueId: "venue-1",
      capacity: 10,
      price: 0,
      organizerId: "user-1",
      categoryId: "cat-1",
      imageUrl: "x",
    });

    await repository.save(event);

    await expect(useCase.execute("evt-1")).resolves.toBeUndefined();

    const found = await repository.findById("evt-1");
    expect(found).toBeNull();
  });

  it("échoue si l'id est vide", async () => {
    await expect(useCase.execute("")).rejects.toThrow("Event id is required");
  });

  it("échoue si l'event n'existe pas", async () => {
    await expect(useCase.execute("unknown")).rejects.toThrow("Event not found");
  });
});
