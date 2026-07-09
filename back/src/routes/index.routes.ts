import { Router } from "express";
import {
  infoHandler,
  downloadHandler,
  progressHandler,
  fileHandler,
} from "../modules/download/download.controller.js";

export const router: Router = Router();

router.post("/info", infoHandler);
router.post("/download", downloadHandler);
router.get("/progress/:jobId", progressHandler);
router.get("/file/:jobId", fileHandler);