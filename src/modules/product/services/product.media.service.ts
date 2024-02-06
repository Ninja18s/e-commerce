import { IMedia } from "@interfaces/product.interface";
import { IProductMedia } from "@interfaces/product.media.interface";
import ProductMediaModel from "@infra/database/mongodb/models/product.media.model";

class ProductMediaService {


  async createMedia(media: IMedia[], productId: string): Promise<void> {
      const productMedia: IProductMedia[] = media.map((media, index=0) => ({
          ...media,
          productId,
        position: index + 1
      }))
    await ProductMediaModel.create(productMedia)
  
  }

//   async update(id: string, product: Partial<IProduct>): Promise<IProduct> {
//     const getProduct = await ProductModel.findOne({ _id: id }).exec();
//     if (!getProduct) {
//       throw UnprocessableEntity("Something went wrong");
//     }
//     Object.assign(getProduct, product);
//     const updatedProduct = await getProduct.save();

//     return updatedProduct;
//   }
}

export default new ProductMediaService();
