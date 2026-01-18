import { Router } from "express";
import { EventController } from "../controllers/EventController";
import { CreateEventUseCase } from "../../application/usecases/CreateEventUseCase";
import { GetAllEventsUseCase } from "../../application/usecases/GetAllEventsUseCase";
import { GetEventByIdUseCase } from "../../application/usecases/GetEventByIdUseCase";
import { EventRepositoryDatabase } from "../../infrastructure/repositories/EventRepositoryDatabase";
import { UpdateEventUseCase } from "../../application/usecases/UpdateEventUseCase";
import { DeleteEventUseCase } from "../../application/usecases/DeleteEventUseCase";

const router = Router();

const repository = new EventRepositoryDatabase();

const createEventUseCase = new CreateEventUseCase(repository);
const getAllEventsUseCase = new GetAllEventsUseCase(repository);
const getEventByIdUseCase = new GetEventByIdUseCase(repository);
const updateEventUseCase = new UpdateEventUseCase(repository);
const deleteEventUseCase = new DeleteEventUseCase(repository);

const controller = new EventController(
  createEventUseCase,
  getAllEventsUseCase,
  getEventByIdUseCase,
  updateEventUseCase,
  deleteEventUseCase
);

router.post("/events", controller.create.bind(controller));
router.get("/events", controller.getAll.bind(controller));
router.get("/events/:id", controller.getById.bind(controller));
router.put("/events/:id", controller.update.bind(controller));
router.delete("/events/:id", controller.delete.bind(controller));

export default router;
