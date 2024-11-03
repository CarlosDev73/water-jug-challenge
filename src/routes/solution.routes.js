import { Router } from "express";
import { getSolution } from "../controllers/solution.controllers.js";

const router = Router();

router.post('/solution', getSolution)


export default router; 