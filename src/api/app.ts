import "dotenv/config";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerOptions from "../../docs/swagger.config";

import express from "express";
import { jsonApiResponseMiddleware } from "./middlewares/jsonApiResponseMiddleware";
import eventRoutes from "./routes/event.route";
import authRoutes from "./routes/auth.route";
import { errorHandlerMiddleware } from "./middlewares/error.middlewares";

const app = express();
const PORT = process.env.PORT || 8000;
app.use(express.json());
const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(jsonApiResponseMiddleware);

app.use("/api", authRoutes);
app.use("/api", eventRoutes);

app.use(errorHandlerMiddleware);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
