import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../../prisma/client";
import { getEnvVariable } from "../utility";
import { hashPassword, verifyPassword } from "../utility/password";
import type { LoginDTO, RegisterDTO, UserPayload } from "../dto/auth.dto";

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body as RegisterDTO;

      if (!body.email || !body.password) {
        return res.jsonError("Email and password are required", 400);
      }

      const existing = await prisma.user.findUnique({
        where: { email: body.email },
      });

      if (existing) {
        return res.jsonError(`Email ${body.email} already exists`, 400);
      }

      const hashed = await hashPassword(body.password);

      const user = await prisma.user.create({
        data: {
          email: body.email,
          passwordHash: hashed,
          role: (body.role as any) ?? "PARTICIPANT",
        },
        select: { id: true, email: true, role: true, createdAt: true },
      });

      return res.jsonSuccess(user, 201);
    } catch (err) {
      next(err);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body as LoginDTO;

      if (!body.email || !body.password) {
        return res.jsonError("Email and password are required", 400);
      }

      const user = await prisma.user.findUnique({
        where: { email: body.email },
      });

      if (!user) {
        return res.jsonError("Invalid credentials", 401);
      }

      const ok = await verifyPassword(body.password, user.passwordHash);
      if (!ok) {
        return res.jsonError("Invalid credentials", 401);
      }

      const payload: UserPayload = { id: user.id, role: user.role as any };

      const token = jwt.sign(payload, getEnvVariable("JWT_SECRET"), {
        expiresIn: "7d",
      });

      return res.jsonSuccess({ token }, 200);
    } catch (err) {
      next(err);
    }
  }
}
