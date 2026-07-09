import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { router } from "../routes/index.routes.js";
import { errorHandler } from "../utils/errorHandler.js";
import { logger } from "../utils/logger.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DOWNLOADS_DIR = path.resolve(__dirname, "../../downloads");

if (!fs.existsSync(DOWNLOADS_DIR)) {
  fs.mkdirSync(DOWNLOADS_DIR, { recursive: true });
  logger.info(`Created downloads directory at ${DOWNLOADS_DIR}`);
}

setInterval(
  () => {
    const ONE_HOUR = 60 * 60 * 1000;
    const now = Date.now();

    fs.readdir(DOWNLOADS_DIR, (err, files) => {
      if (err) return;

      for (const file of files) {
        const filePath = path.join(DOWNLOADS_DIR, file);
        fs.stat(filePath, (statErr, stats) => {
          if (statErr) return;
          if (now - stats.mtimeMs > ONE_HOUR) {
            fs.unlink(filePath, () => {
              logger.info(`Cleaned up old file: ${file}`);
            });
          }
        });
      }
    });
  },
  30 * 60 * 1000,
);

const PORT = process.env.PORT ? Number(process.env.PORT) : 8000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://the-pirate-beats.devdiego.work",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use("/api", router);
app.get("/ping", (req, res) => res.send("pong"));
app.use((req, res) => {
  res.status(404).json({
    message: "Escribe bien mono estupido",
  });
});
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Server listening on port ${PORT}`);
});
