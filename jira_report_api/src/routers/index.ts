import express from "express";
import HealthController from "@/routers/health.router";
import { createReportRoutes } from "@/routers/report.router";
import { JiraService, AlertingService, CronService } from '@/services';
import ApiInfoRoutes from "@/routers/api.info.router";

const router = express.Router();

const jiraService = new JiraService();
const alertingService = new AlertingService();
const cronService = new CronService(jiraService, alertingService);

router.use("/health", HealthController);
router.use("/info", ApiInfoRoutes);
router.use("/report", createReportRoutes(cronService));

export default router;