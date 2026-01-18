import { Router } from "express";

const router = Router();

router.use("/users", require("./user.route"));
router.use("/events", require("./event.route"));

export default router;
