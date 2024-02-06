import { FilterQuery, ProjectionType, QueryOptions } from "mongoose";
import { IPagination } from "@utils/interface";
import { LIMIT } from "@utils/constants";
import FeedbackModel from "@infra/database/mongodb/models/feedback.model";
import { IFeedback } from "@interfaces/feedback.interface";
import { UnprocessableEntity } from "@utils/errors";

class FeedbackService {
  async findOne(
    whereCondition?: FilterQuery<IFeedback>,
    projection?: ProjectionType<IFeedback>,
    option?: QueryOptions<IFeedback>
  ): Promise<IFeedback | null> {
    return await FeedbackModel.findOne(whereCondition, projection, option)
      .populate({
        path: "userId",
        select: "_id name",
      })
      .populate({
        path: "productId",
        select: "_id name",
      })
      .lean();
  }

  async getById(id: string): Promise<IFeedback | null> {
    return await this.findOne({ _id: id });
  }

  async getPaginatedFeedbacksByProduct(
    whereCondition: FilterQuery<IFeedback>,
    pagination: IPagination,
    option: QueryOptions<IFeedback> = {}
  ) {
    let paginationQuery: FilterQuery<IFeedback> = {};
    option!.sort = { createdAt: -1, ...(option?.sort || {}) };
    if (pagination?.hasMore) {
      paginationQuery = {
        $or: [
          {
            createdAt: {
              $lte: pagination.nextCreatedAt,
            },
          },
          {
            createdAt: pagination.nextCreatedAt,
            _id: {
              $lte: pagination.nextId,
            },
          },
        ],
      };
    }
    const feedbacks = await FeedbackModel.find(
      {
        ...whereCondition,
        ...paginationQuery,
      },
      {},
      option
    )
      .limit(LIMIT + 1)
      .populate({
        path: "userId",
        select: "_id name",
      })
      .populate({
        path: "productId",
        select: "_id name",
      })
      .lean();
    const response: {
      feedbacks?: IFeedback[];
      pagination?: IPagination;
    } = {};

    if (feedbacks.length > LIMIT) {
      response.pagination = {
        hasMore: true,
        nextCreatedAt: feedbacks[LIMIT].createdAt.toISOString(),
        nextId: feedbacks[LIMIT]._id.toString(),
      };
    } else {
      response.pagination = {
        hasMore: false,
      };
    }
    response.feedbacks = feedbacks.slice(0, LIMIT);
    return response;
  }

  async addRatingAndReview(feedback: IFeedback): Promise<IFeedback> {
    let newFeedback = await FeedbackModel.findOne({
      productId: feedback.productId,
      userId: feedback.userId,
    });
    if (newFeedback) {
      Object.assign(newFeedback, feedback);
      await newFeedback.save();
    } else {
      newFeedback = new FeedbackModel(feedback);
      await newFeedback.save();
    }

    return newFeedback;
  }

  async update(id: string, feedback: Partial<IFeedback>): Promise<IFeedback> {
    const getFeedback = await FeedbackModel.findOne({
      productId: id,
      userId: feedback.userId,
    }).exec();
    if (!getFeedback) {
      throw UnprocessableEntity("Something went wrong");
    }
    Object.assign(getFeedback, feedback);
    const updatedFeedback = await getFeedback.save();

    return updatedFeedback;
  }
}

export default new FeedbackService();
