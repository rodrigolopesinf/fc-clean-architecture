import { Sequelize } from "sequelize-typescript"
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import ListProductUseCase from "./list.product.usecase";
import CreateProductUseCase from "../create/create.product.usecase";

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

    afterAll(async () => {
        await sequelize.close();
    });

    it("should list a product", async () => {
        const productRepository = new ProductRepository();
        const usecase = new ListProductUseCase(productRepository);
        const usecaseCreate = new CreateProductUseCase(productRepository);

        const input = {
            type: "a",
            name: "Product A",
            price: 20
        };

        const inputB = {
            type: "a",
            name: "Product B",
            price: 30
        };

        await usecaseCreate.execute(input);
        await usecaseCreate.execute(inputB);

        const result = await usecase.execute({});

        expect(result).toEqual({
            "products": [
                {
                    id: expect.any(String),
                    name: input.name,
                    price: input.price
                },
                {
                    id: expect.any(String),
                    name: inputB.name,
                    price: inputB.price
                }
            ]
        });
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