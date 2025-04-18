import { Router } from "express";
import { ApiInfoController } from "@/controllers";

const router = Router();


router.get("/", (req, res) => new ApiInfoController().getApiInfo(req, res));

export default router;
