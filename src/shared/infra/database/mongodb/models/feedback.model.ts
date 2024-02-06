import { Schema } from "mongoose";
import createBaseSchema, { createModel } from "./base.model";
import { IFeedback } from "@interfaces/feedback.interface";

const feedbackSchema = createBaseSchema({
  productId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Product",
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  rating: {
    type: Number,
    required: false,
    min: 0,
    max: 5,
  },
  review: {
    type: String,
    required: false,
  },
  isItemPurchased: {
    type: Boolean,
    default: false,
  },
});

const FeedbackModel = createModel<IFeedback>("Feedback", feedbackSchema);

export default FeedbackModel;
