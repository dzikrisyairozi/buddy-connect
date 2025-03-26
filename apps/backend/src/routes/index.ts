import express, { Router, Request, Response } from "express";

const router: Router = express.Router();

// Health check route
router.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});

export default router;
