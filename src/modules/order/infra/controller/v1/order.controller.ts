// src/controllers/feedback.controller.ts
import { NextFunction, Request, Response } from "express";
import { IPagination } from "@utils/interface";
import OrderService from "@order/services/order.service";
import {
  ICreateOrder,
  OrderFilter,
  OrderSort,
} from "modules/order/interface/order.interface";
import { OrderStatus } from "@interfaces/order.interface";

class OrderControllerV1 {
  constructor(private readonly orderService = OrderService) {}
  async getMyOrders(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const filter: OrderFilter = req.body.filter || {};
      const sortBy: OrderSort = req.body.sortBy ||{};
      filter.userId = req.user!.id;
      const pagination: IPagination = req.body.pagination;
      res.locals.response = await this.orderService.getPaginatedOrdersByFilter(
        filter,
        sortBy,
        pagination
      );
      next();
    } catch (error) {
      next(error);
    }
  }

  async getPaginatedOrderByFilter(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const pagination: IPagination = req.body.pagination;
      const filter = req.body.filter || {};
      const sort = req.body.sort || {};
      filter.productId = req.query.productId;
      res.locals.response = await this.orderService.getPaginatedOrdersByFilter(
        filter,
        sort,
        pagination
      );
      next();
    } catch (error) {
      next(error);
    }
  }
  async getOrderById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      res.locals.response = await this.orderService.getById(id);
      next();
    } catch (error) {
      next(error);
    }
  }

  async createOrder(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const order: ICreateOrder = req.body;
      const userId = req.user!.id;
      const productId = req.params.productId;
      res.locals.response = await this.orderService.createOrder({
        userId,
        productId,
        ...order,
      });
      next();
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const orderId = req.params.orderId;
      const status = req.query.status as OrderStatus;
      res.locals.response = await this.orderService.updateOrderStatus(
        orderId,
        status
      );
      next();
    } catch (error) {
      next(error);
    }
  }
}

export default new OrderControllerV1();
