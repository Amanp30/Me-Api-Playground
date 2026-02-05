import express from "express";

import AllRoutes from "./src/routes/index.js";
import morgan from "morgan";
import cors from "cors";
import { ALLOWED_DOMAINS } from "./src/config/env_vars.js";

const app = express();

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like Postman or mobile apps)
      if (!origin) return callback(null, true);

      if (ALLOWED_DOMAINS.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (req, res) => {
  res.status(200).send("API is healthy");
});

app.use("/api", AllRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Route Not Found" });
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ error: "Internal Server Error" });
});

export default app;
