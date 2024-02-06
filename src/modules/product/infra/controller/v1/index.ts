import express from "express";
import validatePayload from "@utils/validator";
import authMiddleware from "@utils/auth.middleware";
import productControllerV1 from "./product.controller";
import {
  productSchema,
  updateProductSchema,
} from "@product/validator/product.validator";

const router = express.Router();

router
  .route("/")
  .post(
    authMiddleware(),
    validatePayload(productSchema),
    productControllerV1.createProduct.bind(productControllerV1)
  );
router
  .route("/paginated")
  .post(
    authMiddleware(),
    productControllerV1.getProducts.bind(productControllerV1)
  );

router
  .route("/:id")
  .get(
    authMiddleware(),
    productControllerV1.getProductById.bind(productControllerV1)
  )
  .patch(
    authMiddleware(),
    validatePayload(updateProductSchema),
    productControllerV1.updateProductById.bind(productControllerV1)
  );

export { router as productRouteV1 };
