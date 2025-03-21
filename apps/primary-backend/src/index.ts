import express from "express";
import { userRouter } from "./routes/v1/user";
import { zapRouter } from "./routes/v1/zap";
import cors from "cors";

const app = express();
app.use(express.json())
app.use(cors())

app.use("/api/v1/user", userRouter);

app.use("/api/v1/zap", zapRouter);


app.listen(3000);