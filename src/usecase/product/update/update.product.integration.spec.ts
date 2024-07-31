import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import UpdateProductUseCase from "./update.product.usecase";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import Product from "../../../domain/product/entity/product";
import CreateProductUseCase from "../create/create.product.usecase";

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
        await sequelize.close();
    });

    it("should update a product", async () => {
        const productRepository = new ProductRepository();
        const usecase = new UpdateProductUseCase(productRepository);
        const usecaseCreate = new CreateProductUseCase(productRepository);

        const inputCreate = {
            type: "a",
            name: "Product A",
            price: 20
        };

        const outputCreate = await usecaseCreate.execute(inputCreate);

        const input = {
            id: outputCreate.id,
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
        const usecaseCreate = new CreateProductUseCase(productRepository);

        const inputCreate = {
            type: "a",
            name: "Product A",
            price: 20
        };

        const output = await usecaseCreate.execute(inputCreate);

        const input = {
            id: output.id,
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
        const usecaseCreate = new CreateProductUseCase(productRepository);

        const inputCreate = {
            type: "a",
            name: "Product A",
            price: 20
        };

        const output = await usecaseCreate.execute(inputCreate);

        const input = {
            id: output.id,
            name: "Product B",
            price: -1
        };

        expect(async () => {
            return await usecase.execute(input);
        }).rejects.toThrow("Price must be greater than zero")
    });
})