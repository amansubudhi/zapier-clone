import { Router } from "express";
import { authMiddleware } from "../../middleware";
import { SigninSchema, SignupSchema } from "../../types";
import client from "@repo/db/client"
import jwt from "jsonwebtoken"
import { JWT_PASSWORD } from "../../config";

const router = Router();

router.get("/available", async (req, res) => {
    const availableActions = await client.availableAction.findMany({});
    res.json({
        availableActions
    })
})


export const actionRouter = router;