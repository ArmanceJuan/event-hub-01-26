// src/api/controllers/EventController.ts
import { Request, Response, NextFunction } from "express";

import { CreateEventUseCase } from "../../application/usecases/CreateEventUseCase";
import { GetAllEventsUseCase } from "../../application/usecases/GetAllEventsUseCase";
import { GetEventByIdUseCase } from "../../application/usecases/GetEventByIdUseCase";
import { UpdateEventUseCase } from "../../application/usecases/UpdateEventUseCase";
import { CreateEventDTO } from "../dto/create.dto";
import { UpdateEventDTO } from "../dto/update.dto";
import { DeleteEventUseCase } from "../../application/usecases/DeleteEventUseCase";

export class EventController {
  constructor(
    private readonly createEventUseCase: CreateEventUseCase,
    private readonly getAllEventsUseCase: GetAllEventsUseCase,
    private readonly getEventByIdUseCase: GetEventByIdUseCase,
    private readonly updateEventUseCase: UpdateEventUseCase,
    private readonly deleteEventUseCase: DeleteEventUseCase
  ) {}

  // POST /api/events
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = req.body as CreateEventDTO;

      const event = await this.createEventUseCase.execute({
        title: dto.title,
        description: dto.description,
        startDate: new Date(dto.startDate),
        venueId: dto.venueId,
        capacity: dto.capacity,
        price: dto.price,
        organizerId: dto.organizerId,
        categoryId: dto.categoryId,
        imageUrl: dto.imageUrl,
      });

      return res.status(201).json({
        success: true,
        data: event,
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/events
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const events = await this.getAllEventsUseCase.execute();
      return res.status(200).json({
        success: true,
        data: events,
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/events/:id
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const rawId = req.params.id;

      if (!rawId || Array.isArray(rawId)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid event id" });
      }

      const event = await this.getEventByIdUseCase.execute(rawId);

      if (!event) {
        return res
          .status(404)
          .json({ success: false, message: "Event not found" });
      }

      return res.status(200).json({ success: true, data: event });
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/events/:id
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const rawId = req.params.id;
      if (!rawId || Array.isArray(rawId)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid event id" });
      }

      const dto = req.body as UpdateEventDTO;

      const updated = await this.updateEventUseCase.execute(rawId, {
        ...dto,
        startDate: new Date(dto.startDate),
      });

      return res.status(200).json({ success: true, data: updated });
    } catch (e: any) {
      if (e?.message === "Event not found") {
        return res
          .status(404)
          .json({ success: false, message: "Event not found" });
      }
      next(e);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const rawId = req.params.id;
      if (!rawId || Array.isArray(rawId)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid event id" });
      }

      await this.deleteEventUseCase.execute(rawId);

      return res.status(204).send();
    } catch (e: any) {
      if (e?.message === "Event not found") {
        return res
          .status(404)
          .json({ success: false, message: "Event not found" });
      }
      next(e);
    }
  }
}
