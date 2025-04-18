import { Router } from "express";
import { HealthController } from "@/controllers";

const router = Router();

// Use the controller from the facade
router.get("/", (req, res) => new HealthController().checkHealth(req, res));

export default router;
