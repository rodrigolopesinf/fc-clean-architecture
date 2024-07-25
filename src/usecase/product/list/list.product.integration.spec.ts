import { Sequelize } from "sequelize-typescript"
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import ListProductUseCase from "./list.product.usecase";
import Product from "../../../domain/product/entity/product";

describe("Test find list use case", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: "memory",
            logging: false,
            sync: { force: true },
        });

        await sequelize.addModels([ProductModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should list a product", async () => {
        const productRepository = new ProductRepository();
        const usecase = new ListProductUseCase(productRepository);

        const product = new Product("123", "Product A", 20);
        const product2 = new Product("456", "Product B", 30);

        await productRepository.create(product);
        await productRepository.create(product2);

        const output = {
            "products": [{
                id: "123",
                name: "Product A",
                price: 20
            },
            {
                id: "456",
                name: "Product B",
                price: 30
            }]
        };

        const result = await usecase.execute({});

        expect(result).toEqual(output);
    });

    it("should list not a product", async () => {
        const productRepository = new ProductRepository();
        const usecase = new ListProductUseCase(productRepository);

        const output = {
            "products": new Array()
        };

        const result = await usecase.execute({});

        expect(result).toEqual(output);
    });

});


