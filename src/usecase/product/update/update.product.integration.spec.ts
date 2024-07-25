import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import UpdateProductUseCase from "./update.product.usecase";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import Product from "../../../domain/product/entity/product";

describe("Test update product use case", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: "memory",
            logging: false,
            sync: { force: true }
        });

        await sequelize.addModels([ProductModel]);
        await sequelize.sync();
    });

    afterAll(async () => {
        sequelize.close();
    });

    it("should update a product", async () => {
        const productRepository = new ProductRepository();
        const usecase = new UpdateProductUseCase(productRepository);

        const product = new Product("123", "Product A", 20);
        await productRepository.create(product);

        const input = {
            id: "123",
            name: "Product B",
            price: 30
        };

        var output = await usecase.execute(input);

        expect(output).toEqual({
            id: input.id,
            name: input.name,
            price: input.price
        });
    });

    it("should thrown an error when name is missing", async () => {
        const productRepository = new ProductRepository();
        const usecase = new UpdateProductUseCase(productRepository);

        const product = new Product("123", "Product A", 20);
        await productRepository.create(product);

        const input = {
            id: "123",
            name: "",
            price: 30
        };

        expect(async () => {
            return await usecase.execute(input);
        }).rejects.toThrow("Name is required");
    });

    it("should thrown an error when price is less than zero", async () => {
        const productRepository = new ProductRepository();
        const usecase = new UpdateProductUseCase(productRepository);

        const product = new Product("123", "Product A", 20);
        await productRepository.create(product);

        const input = {
            id: "123",
            name: "Product B",
            price: -1
        };

        expect(async () => {
            return await usecase.execute(input);
        }).rejects.toThrow("Price must be greater than zero");
    });
})