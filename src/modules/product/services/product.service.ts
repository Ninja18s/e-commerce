import mongoose, {
  AggregateOptions,
  FilterQuery,
  ProjectionType,
  QueryOptions,
} from "mongoose";
import { IPagination } from "@utils/interface";
import { LIMIT } from "@utils/constants";
import ProductModel from "@infra/database/mongodb/models/product.model";
import { IMedia, IProduct } from "@interfaces/product.interface";
import { UnprocessableEntity } from "@utils/errors";
import ProductMediaService from "./product.media.service";
import {
  IProductFilter,
  IProductPagination,
  IProductSort,
} from "@product/interface/product.interface";
import { IFeedback } from "@interfaces/feedback.interface";

class ProductService {
  constructor(private readonly productMediaService = ProductMediaService) {}
  async findOne(
    whereCondition?: FilterQuery<IProduct>,
    projection?: ProjectionType<IProduct>,
    option?: QueryOptions<IProduct>
  ): Promise<IProduct | null> {
    return await ProductModel.findOne(whereCondition, projection, option)
      .populate("media")
      .lean();
  }

  async getById(id: string): Promise<IProduct | null> {
    return await this.findOne({ _id: id });
  }

  async getPaginatedProducts(
    filterCondition: IProductFilter,
    pagination: IProductPagination,
    sortCondition: IProductSort
  ) {
    const filter: FilterQuery<any> = {};
    const aggregation = [];
    if (filterCondition.availability) {
      filter.availability = { $gt: 0 };
    }
    if (filterCondition.category) {
      filter.category = filterCondition.category;
    }
    if (filterCondition.price) {
      filter.price = {}
      filter.price["$gte"] = filterCondition.price.min || 0;
      filterCondition.price.max
        ? (filter.price["$lte"] = filterCondition.price.max)
        : undefined;
    }
    if (filterCondition.name) {
      filter.name = { $regex: filterCondition.name };
    }
    const ratingFilter: FilterQuery<any> = {};
    if (Object.values(sortCondition).length === 0) {
      sortCondition.createdAt = -1;
    }
    if (filterCondition.rating) {
      ratingFilter.rating = {};
      ratingFilter.rating["$gte"] = filterCondition.rating.min || 0;
      ratingFilter.rating["$lte"] = filterCondition.rating.max || 5;
    }
    aggregation.push(
      {
        $match: filter,
      },
      {
        $lookup: {
          from: "feedbacks",
          localField: "_id",
          foreignField: "productId",
          as: "feedbacks",
          pipeline: [
            {
              $project: {
                _id: 1,
                rating: 1,
                review: 1,
                userId: 1,
              },
            },
          ],
        },
      },
      {
        $addFields: {
          rating: {
            $avg: "$feedbacks.rating",
          },
          totalReview: {
            $size: {
              $filter: {
                input: "$feedbacks",
                as: "feedback",
                cond: { $ne: ["$$feedback.review", null] },
              },
            },
          },
        },
      }
    );
    if (filterCondition.rating?.min || filterCondition.rating?.max) {
      aggregation.push({ $match: ratingFilter });
    }
    aggregation.push(
      {
        $lookup: {
          from: "productmedias",
          localField: "_id",
          foreignField: "productId",
          as: "productMedias",
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$isVisible", true],
                },
              },
            },
            {
              $sort: {
                position: 1,
              },
            },
            {
              $project: {
                _id: 1,
                url: 1,
                mediaType: 1,
              },
            },
          ],
        },
      },
      {
        $sort: sortCondition,
      },
      {
        $skip: pagination.skip || 0,
      },
      {
        $limit: (pagination.limit || LIMIT) + 1,
      },
      {
        $project: {
          _id: 1,
          name: 1,
          availability: 1,
          description: 1,
          price: 1,
          category: 1,
          createdAt: 1,
          totalReview: 1,
          rating: {
            $ifNull: ["$rating", 0],
          },
          media: 1,
        },
      }
    );
    // @ts-ignore
    const products: IProduct[] = await ProductModel.aggregate(aggregation);
    const response: {
      products?: IProduct[];
      pagination?: IProductPagination;
    } = {};

    if (products.length > (pagination.limit || LIMIT)) {
      response.pagination = {
        hasMore: true,
        limit: pagination.limit || LIMIT,
        skip: pagination.skip || 0,
      };
    } else {
      response.pagination = {
        hasMore: false,
      };
    }
    response.products = products.slice(0, pagination.limit || LIMIT);
    return response;
  }

  async createProduct(product: IProduct): Promise<IProduct> {
    let media: IMedia[] | undefined;
    if (product.media?.length) {
      media = product.media;
      delete product.media;
    }
    const newProduct = new ProductModel(product);
    await newProduct.save();
    if (media?.length) {
      await this.productMediaService.createMedia(
        media,
        newProduct._id.toString()
      );
    }
    return newProduct;
  }

  async update(id: string, product: Partial<IProduct>): Promise<IProduct> {
    const getProduct = await ProductModel.findOne({ _id: id }).exec();
    if (!getProduct) {
      throw UnprocessableEntity("Something went wrong");
    }
    Object.assign(getProduct, product);
    const updatedProduct = await getProduct.save();

    return updatedProduct;
  }

  async updateInternal(id: string, quantityConsumed: number): Promise<void> {
    const product = await ProductModel.findOne({ _id: id }).exec();
    product!.availability = product!.availability - quantityConsumed;
    await product!.save();
  }
}

export default new ProductService();
