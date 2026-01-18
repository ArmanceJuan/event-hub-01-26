import { Router } from "express";
import { AuthController } from "../controllers/AuthController";

const router = Router();
const controller = new AuthController();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Créer un utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: "orga@test.com"
 *               password:
 *                 type: string
 *                 example: "123456"
 *               role:
 *                 type: string
 *                 example: "ORGANIZER"
 *     responses:
 *       201:
 *         description: Utilisateur créé
 *       400:
 *         description: Données invalides / email déjà existant
 */

router.post("/auth/register", controller.register.bind(controller));

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Se connecter (retourne un JWT)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: "orga@test.com"
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: JWT retourné
 *       401:
 *         description: Identifiants invalides
 */

router.post("/auth/login", controller.login.bind(controller));

export default router;
