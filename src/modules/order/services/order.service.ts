import mongoose, { FilterQuery, ProjectionType, QueryOptions } from "mongoose";
import { IPagination } from "@utils/interface";
import { LIMIT } from "@utils/constants";
import { UnprocessableEntity } from "@utils/errors";
import OrderModel from "@infra/database/mongodb/models/order.model";
import { IOrder, OrderStatus } from "@interfaces/order.interface";
import ProductService from "@product/services/product.service";
import {
  Comparison,
  ComparisonType,
  ComparisonTypeOperation,
  OrderFilter,
  OrderSort,
} from "../interface/order.interface";

class OrderService {
  constructor(private readonly productService = ProductService) {}
  async findOne(
    whereCondition?: FilterQuery<IOrder>,
    projection?: ProjectionType<IOrder>,
    option?: QueryOptions<IOrder>
  ): Promise<IOrder | null> {
    return await OrderModel.findOne(whereCondition, projection, option).lean();
  }

  async getById(id: string): Promise<IOrder | null> {
    return await this.findOne({ _id: id });
  }

  async getPaginatedOrder(
    whereCondition: FilterQuery<IOrder>,
    pagination: IPagination,
    option: QueryOptions<IOrder> = {}
  ) {
    let paginationQuery: FilterQuery<IOrder> = {};
    option!.sort = { createdAt: -1, ...(option?.sort || {})}
    if (pagination?.hasMore) {
      paginationQuery = {
        $or: [
          {
            createdAt: {
              $lte : pagination.nextCreatedAt,
            },
          },
          {
            createdAt: pagination.nextCreatedAt,
            _id : {
              $lte: pagination.nextId,
            },
          },
        ],
      };
    };
    
    const orders = await OrderModel.find(
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
      orders?: IOrder[];
      pagination?: IPagination;
    } = {};

    if (orders.length > LIMIT) {
      response.pagination = {
        hasMore: true,
        nextCreatedAt: orders[LIMIT].createdAt.toISOString(),
        nextId: orders[LIMIT]._id.toString(),
      };
    } else {
      response.pagination = {
        hasMore: false,
      };
    }
    response.orders = orders.slice(0, LIMIT);
    return response;
  }

  async getPaginatedOrdersByFilter(
    filter: OrderFilter,
    sort: OrderSort,
    pagination: IPagination
  ) {
    const filterCondition: FilterQuery<IOrder> = {};
    const sortCondition: QueryOptions<IOrder> = {};
    const andCondition: FilterQuery<IOrder> = [];
    Object.entries(filter).forEach(([key, value]) => {
      const orCondition: FilterQuery<IOrder> = [];

      if (Array.isArray(value)) {
        value.forEach((comparison: Comparison) => {
          const conditionOperator =
            ComparisonTypeOperation[comparison.condition];

          const obj = {
            [key]: { [conditionOperator]: comparison.value },
          };
          orCondition.push(obj);
        });

        andCondition.push({ $or: orCondition });
      } else if (typeof value === "string") {
        filterCondition[key] = value;
      }
      if (Array.isArray(andCondition) && typeof value !== 'undefined') {
        if (!filterCondition["$and"]?.length) {
          filterCondition["$and"] = [];
        }
        filterCondition["$and"].push(...andCondition);
      }
    });
    Object.entries(sort).forEach(([key, value]) => {
      if (value) {
        sortCondition[key] = value;
      }
    });
    return this.getPaginatedOrder(filterCondition, pagination, {
      sort: sortCondition,
    });
  }

  async createOrder(order: IOrder): Promise<IOrder> {
    const product = await this.productService.findOne(
      { _id: order.productId, availability: { $gt: order.quantity } },
      { availability: 1, price: 1, media: 0 }
    );
    if (!product) {
      throw UnprocessableEntity(
        `Product is not available right now try when restock`
      );
    }
    order.costPerItem = product.price;
    order.totalAmount =
      order.costPerItem * order.quantity -
      (order.discountInPer || 0) * order.costPerItem * 0.01;

    const newOrder = new OrderModel(order);

    await newOrder.save();
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      await this.productService.updateInternal(order.productId, order.quantity);
      await session.commitTransaction();
      session.endSession();
      newOrder.status = OrderStatus.COMPLETED;
      await newOrder.save();
      return newOrder;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      newOrder.status = OrderStatus.FAILED;
      newOrder.failedReason = "Item exhausted";
      await newOrder.save();
      throw UnprocessableEntity(
        "Something went wrong try again after some time"
      );
    }
  }

  async updateOrderStatus(
    id: string,
    orderStatus: OrderStatus
  ): Promise<IOrder> {
    const order = await OrderModel.findOne({
      _id: id,
    }).exec();
    if (!order) {
      throw UnprocessableEntity("Something went wrong");
    }
    order.status = orderStatus;
    await order.save();
    return order;
  }
}

export default new OrderService();
