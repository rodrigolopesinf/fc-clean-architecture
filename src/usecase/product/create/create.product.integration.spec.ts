import { Sequelize } from "sequelize-typescript"
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import CreateProductUseCase from "./create.product.usecase";

describe("Test create product use case", () => {
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

    afterEach(async () => {
        sequelize.close();
    });

    it("should create a product", async () => {
        const productRepository = new ProductRepository();
        const usecase = new CreateProductUseCase(productRepository);

        const input = {
            type: "a",
            name: "Product A",
            price: 20
        };

        var output = await usecase.execute(input);

        const result = await productRepository.find(output.id);

        expect(output).toEqual({
            id: expect.any(String),
            name: result.name,
            price: result.price
        });
    });

    it("should thrown an error when name is missing", async () => {
        const productRepository = new ProductRepository();
        const usecase = new CreateProductUseCase(productRepository);

        const input = {
            type: "a",
            name: "Product A",
            price: 20
        };

        expect(() => {
            input.name = "";
            return usecase.execute(input)
        }).rejects.toThrow("Name is required");
    });

    it("should thrown an error when price is less than zero", async () => {
        const productRepository = new ProductRepository();
        const usecase = new CreateProductUseCase(productRepository);

        const input = {
            type: "a",
            name: "Product A",
            price: 20
        };

        expect(() => {
            input.price = -1;
            return usecase.execute(input)
        }).rejects.toThrow("Price must be greater than zero");
    });
});