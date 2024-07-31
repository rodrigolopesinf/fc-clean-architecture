
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import FindProductUseCase from "./find.product.usecase";
import Product from "../../../domain/product/entity/product";
import { Sequelize } from "sequelize-typescript";
import CreateProductUseCase from "../create/create.product.usecase";

describe("Test find product use case", () => {
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

    afterAll(async () => {
        await sequelize.close();
    });

    it("Should find a product", async () => {
        const productRepository = new ProductRepository();
        const usecase = new FindProductUseCase(productRepository);
        const usecaseCreate = new CreateProductUseCase(productRepository);

        const input = {
            type: "a",
            name: "Product A",
            price: 20
        };

        const output = await usecaseCreate.execute(input);

        const inputFind = {
            id: output.id
        }

        const result = await usecase.execute(inputFind);

        expect(result).toEqual({
            id: expect.any(String),
            name: input.name,
            price: input.price
        });
    });

    it("Should not a find product", async () => {
        const productRepository = new ProductRepository();
        const usecase = new FindProductUseCase(productRepository);

        const input = {
            id: "456"
        }

        expect(async () => {
            return await usecase.execute(input);
        }).rejects.toThrow("Product not found")
    });
})