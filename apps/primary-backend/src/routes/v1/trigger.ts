import { Router } from "express";
import { authMiddleware } from "../../middleware";
import { SigninSchema, SignupSchema } from "../../types";
import client from "@repo/db/client"
import jwt from "jsonwebtoken"
import { JWT_PASSWORD } from "../../config";

const router = Router();

router.get("/available", async (req, res) => {
    const availableTriggers = await client.availableTrigger.findMany({});
    res.json({
        availableTriggers
    })
})


export const triggerRouter = router;