import ProductFactory from "../../../domain/product/factory/product.factory";
import UpdateProductUseCase from "./update.product.usecase";

const product = ProductFactory.create("a", "Product A", 20);

const input = {
    id: product.id,
    name: "Product B",
    price: 20
}

const MockRepository = () => {
    return {
        create: jest.fn(),
        findAll: jest.fn(),
        find: jest.fn().mockReturnValue(Promise.resolve(product)),
        update: jest.fn(),
    };
};

describe("Unit test for product update use case", () => {
    it("should update a product", async () => {
        const productRepository = MockRepository();
        const usecase = new UpdateProductUseCase(productRepository);

        const output = await usecase.execute(input);

        expect(output).toEqual(input);
    });

    // it("should thrown an error when name is missing", async () => {
    //     const productRepository = MockRepository();
    //     const usecase = new UpdateProductUseCase(productRepository);

    //     input.name = "";

    //     expect(() => {
    //         input.name = "";
    //         return usecase.execute(input);
    //     }).rejects.toThrow("Name is required");
    // });

    // it("should thrown an error when price is less than zero", async () => {
    //     const productRepository = MockRepository();
    //     const usecase = new UpdateProductUseCase(productRepository);

    //     expect(() => {
    //         input.price = -1;
    //         return usecase.execute(input);
    //     }).rejects.toThrow("Price must be greater than zero");
    // })
});