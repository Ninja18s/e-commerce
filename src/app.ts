import express, { Request, Response } from "express";
import {  loggingMiddleware, onError, onResponse } from "@utils/api.handler";
import { userRouteV1 } from "./modules/user/infra/controller/v1";
import { productRouteV1 } from "@product/infra/controller/v1";
import { feedbackRouteV1 } from "@feedback/infra/controller/v1";
import { orderRouteV1 } from "@order/infra/controller/v1";

const app = express();

app.use(express.json());
app.use(loggingMiddleware)

app.get("/", (_req: Request, res: Response) =>
  res.status(200).json({ message: "Api is running... " })
);
app.use("/user", userRouteV1);
app.use("/product", productRouteV1);
app.use("/feedback", feedbackRouteV1);
app.use("/order", orderRouteV1);

app.use(onResponse);

app.use(onError);
export default app;
