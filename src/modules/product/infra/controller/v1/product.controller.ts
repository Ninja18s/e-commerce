// src/controllers/product.controller.ts
import { NextFunction, Request, Response } from "express";
import ProductService from "@product/services/product.service";
import { IProduct } from "@interfaces/product.interface";
import { IProductFilter, IProductPagination, IProductSort } from "@product/interface/product.interface";

class ProductControllerV1 {
  constructor(private readonly productService = ProductService) {}
  async getProducts(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const pagination: IProductPagination = req.body.pagination || {};
      const filter: IProductFilter = req.body.filter || {};
      const sort: IProductSort = req.body.sort || {};
      res.locals.response = await this.productService.getPaginatedProducts(
        filter,
        pagination,
        sort
      );
      next();
    } catch (error) {
      next(error);
    }
  }

  async getProductById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      res.locals.response = await this.productService.getById(id);
      next();
    } catch (error) {
      next(error);
    }
  }

  async createProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const product: IProduct = req.body;
      product.createdBy = req.user!.id;
      res.locals.response = await this.productService.createProduct(product);
      next();
    } catch (error) {
      next(error);
    }
  }

  async updateProductById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const productId = req.params.id;
      const product: Partial<IProduct> = req.body;
      product.updatedBy = req.user!.id;
      res.locals.response = await this.productService.update(productId,product);
      next();
    } catch (error) {
      next(error);
    }
  }
  
}

export default new ProductControllerV1();
