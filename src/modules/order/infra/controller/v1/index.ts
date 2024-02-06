import express from "express";
import validatePayload from "@utils/validator";
import authMiddleware from "@utils/auth.middleware";
import orderControllerV1 from "./order.controller";
import {
  getPaginatedOrdersByFilterSchema,
  orderSchema,
} from "@order/validator/order.validator";

const router = express.Router();

router
  .route("/my-orders")
  .post(
    authMiddleware(),
    validatePayload(getPaginatedOrdersByFilterSchema),
    orderControllerV1.getMyOrders.bind(orderControllerV1)
  );
router
  .route("/paginated")
  .post(
    authMiddleware(),
    validatePayload(getPaginatedOrdersByFilterSchema),
    orderControllerV1.getPaginatedOrderByFilter.bind(orderControllerV1)
  );
router
  .route("/")
  .post(
    authMiddleware(),
    validatePayload(orderSchema),
    orderControllerV1.createOrder.bind(orderControllerV1)
  );

router
  .route("/:id")
  .get(authMiddleware(), orderControllerV1.getOrderById.bind(orderControllerV1))
  .patch(
    authMiddleware(),
    orderControllerV1.getOrderById.bind(orderControllerV1)
  );

export { router as orderRouteV1 };
