import express from "express";
import cors from "cors";

import { userRouter } from "./routes/v1/user";
import { zapRouter } from "./routes/v1/zap";
import { triggerRouter } from "./routes/v1/trigger";
import { actionRouter } from "./routes/v1/action";

const app = express();
app.use(express.json())
app.use(cors())

app.use("/api/v1/user", userRouter);

app.use("/api/v1/zap", zapRouter);

app.use("/api/v1/trigger", triggerRouter);

app.use("/api/v1/action", actionRouter);


app.listen(3000);