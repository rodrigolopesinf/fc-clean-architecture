import Product from "../../../domain/product/entity/product";
import ProductFactory from "../../../domain/product/factory/product.factory";
import ProductRepositoryInterface from "../../../domain/product/repository/product-repository.interface";
import { InputCreateProductDto, OutPutCreateProductDto } from "./create.product.dto";

export default class CreateProductUseCase {
    private productRepository: ProductRepositoryInterface;

    constructor(productRepository: ProductRepositoryInterface) {
        this.productRepository = productRepository;
    }

    async execute(
        input: InputCreateProductDto
    ): Promise<OutPutCreateProductDto> {
        const product = ProductFactory.create(input.type, input.name, input.price);

        const productCreate = new Product(product.id, product.name, product.price);
        await this.productRepository.create(productCreate);

        return {
            id: product.id,
            name: product.name,
            price: product.price,
        }
    };
}