// src/controllers/feedback.controller.ts
import { NextFunction, Request, Response } from "express";
import { IPagination } from "@utils/interface";
import FeedbackService from "@feedback/services/feedback.service";
import { IFeedback } from "@interfaces/feedback.interface";

class FeedbackControllerV1 {
  constructor(private readonly feedbackService = FeedbackService) {}
  async getPaginatedFeedbackByProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const productId = req.params.productId;
      const pagination: IPagination = req.body.pagination;
      // const query
      res.locals.response =
        await this.feedbackService.getPaginatedFeedbacksByProduct(
          { productId },
          pagination
        );
      next();
    } catch (error) {
      next(error);
    }
  }

  async getSingleReviewById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      res.locals.response = await this.feedbackService.getById(id);
      next();
    } catch (error) {
      next(error);
    }
  }

  async addRatingAndReviewByProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId =req.user!.id;
      const productId = req.params.productId;
      const {
        rating,
        review,
        isItemPurchased,
      }: { rating: number; review: string; isItemPurchased?: boolean } =
        req.body;
      res.locals.response = await this.feedbackService.addRatingAndReview({
        userId,
        productId,
        isItemPurchased,
        rating,
        review,
      });
      next();
    } catch (error) {
      next(error);
    }
  }

  async updateReview(req: Request, res: Response, next: NextFunction): Promise<void>{

    try {
      const productId = req.params.productId;
      const feedback: Partial<IFeedback> = req.body;
      feedback.userId = req.user!.id;
      res.locals.response = await this.feedbackService.update(productId,feedback);
      next();
    } catch (error) {
      next(error);
    }
  
  }
}

export default new FeedbackControllerV1();
