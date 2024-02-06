import express from "express";
import validatePayload from "@utils/validator";
import authMiddleware from "@utils/auth.middleware";
import feedbackControllerV1 from "./feedback.controller";
import {
  feedbackSchema,
  idSchema,
  updateFeedbackSchema,
} from "@feedback/validator/feedback.validator";

const router = express.Router();

router
  .route("/:productId")
  .post(
    authMiddleware(),
    validatePayload(feedbackSchema),
    feedbackControllerV1.addRatingAndReviewByProduct.bind(feedbackControllerV1)
  )
  .patch(
    authMiddleware(),
    validatePayload(updateFeedbackSchema),
    feedbackControllerV1.updateReview.bind(feedbackControllerV1)
  );
router
  .route("/paginated/:productId")
  .post(
    authMiddleware(),
    validatePayload(idSchema),
    feedbackControllerV1.getPaginatedFeedbackByProduct.bind(
      feedbackControllerV1
    )
  );

router
  .route("/:id")
  .get(
    authMiddleware(),
    feedbackControllerV1.getSingleReviewById.bind(feedbackControllerV1)
  );

export { router as feedbackRouteV1 };
