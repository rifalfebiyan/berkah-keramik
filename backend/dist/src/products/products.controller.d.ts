import { ProductsService } from './products.service';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    create(createProductDto: any): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        imageUrl: string | null;
        flashSaleEndsAt: Date | null;
        description: string | null;
        price: number;
        oldPrice: number | null;
        discount: string | null;
        stock: number;
        sold: number;
        rating: number;
        isFlashSale: boolean;
        size: string | null;
        color: string | null;
        brandId: number;
        categoryId: number;
        subcategoryId: number | null;
    }>;
    findAll(categoryId?: string, brandId?: string, minPrice?: string, maxPrice?: string): Promise<({
        brand: {
            id: number;
            name: string;
            logoUrl: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        category: {
            id: number;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            imageUrl: string | null;
        };
        subcategory: {
            id: number;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            imageUrl: string | null;
            categoryId: number;
        } | null;
    } & {
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        imageUrl: string | null;
        flashSaleEndsAt: Date | null;
        description: string | null;
        price: number;
        oldPrice: number | null;
        discount: string | null;
        stock: number;
        sold: number;
        rating: number;
        isFlashSale: boolean;
        size: string | null;
        color: string | null;
        brandId: number;
        categoryId: number;
        subcategoryId: number | null;
    })[]>;
    findOne(id: string): Promise<({
        brand: {
            id: number;
            name: string;
            logoUrl: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        category: {
            id: number;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            imageUrl: string | null;
        };
        subcategory: {
            id: number;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            imageUrl: string | null;
            categoryId: number;
        } | null;
    } & {
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        imageUrl: string | null;
        flashSaleEndsAt: Date | null;
        description: string | null;
        price: number;
        oldPrice: number | null;
        discount: string | null;
        stock: number;
        sold: number;
        rating: number;
        isFlashSale: boolean;
        size: string | null;
        color: string | null;
        brandId: number;
        categoryId: number;
        subcategoryId: number | null;
    }) | null>;
    update(id: string, updateProductDto: any): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        imageUrl: string | null;
        flashSaleEndsAt: Date | null;
        description: string | null;
        price: number;
        oldPrice: number | null;
        discount: string | null;
        stock: number;
        sold: number;
        rating: number;
        isFlashSale: boolean;
        size: string | null;
        color: string | null;
        brandId: number;
        categoryId: number;
        subcategoryId: number | null;
    }>;
    remove(id: string): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        imageUrl: string | null;
        flashSaleEndsAt: Date | null;
        description: string | null;
        price: number;
        oldPrice: number | null;
        discount: string | null;
        stock: number;
        sold: number;
        rating: number;
        isFlashSale: boolean;
        size: string | null;
        color: string | null;
        brandId: number;
        categoryId: number;
        subcategoryId: number | null;
    }>;
}
