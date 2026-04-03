import { ProductsService } from './products.service';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    create(createProductDto: any): Promise<{
        name: string;
        description: string | null;
        price: number;
        oldPrice: number | null;
        discount: string | null;
        stock: number;
        sold: number;
        rating: number;
        imageUrl: string | null;
        isFlashSale: boolean;
        flashSaleEndsAt: Date | null;
        size: string | null;
        color: string | null;
        images: string[];
        createdAt: Date;
        updatedAt: Date;
        id: number;
        brandId: number;
        categoryId: number;
        subcategoryId: number | null;
    }>;
    findAll(categoryId?: string, subcategoryId?: string, brandId?: string, minPrice?: string, maxPrice?: string, search?: string, sort?: string, limit?: string, page?: string): Promise<{
        data: ({
            brand: {
                name: string;
                createdAt: Date;
                updatedAt: Date;
                id: number;
                logoUrl: string | null;
            };
            category: {
                name: string;
                imageUrl: string | null;
                createdAt: Date;
                updatedAt: Date;
                id: number;
            };
            subcategory: {
                name: string;
                imageUrl: string | null;
                createdAt: Date;
                updatedAt: Date;
                id: number;
                categoryId: number;
            } | null;
        } & {
            name: string;
            description: string | null;
            price: number;
            oldPrice: number | null;
            discount: string | null;
            stock: number;
            sold: number;
            rating: number;
            imageUrl: string | null;
            isFlashSale: boolean;
            flashSaleEndsAt: Date | null;
            size: string | null;
            color: string | null;
            images: string[];
            createdAt: Date;
            updatedAt: Date;
            id: number;
            brandId: number;
            categoryId: number;
            subcategoryId: number | null;
        })[];
        total: number;
    }>;
    findOne(id: string): Promise<({
        brand: {
            name: string;
            createdAt: Date;
            updatedAt: Date;
            id: number;
            logoUrl: string | null;
        };
        category: {
            name: string;
            imageUrl: string | null;
            createdAt: Date;
            updatedAt: Date;
            id: number;
        };
        subcategory: {
            name: string;
            imageUrl: string | null;
            createdAt: Date;
            updatedAt: Date;
            id: number;
            categoryId: number;
        } | null;
    } & {
        name: string;
        description: string | null;
        price: number;
        oldPrice: number | null;
        discount: string | null;
        stock: number;
        sold: number;
        rating: number;
        imageUrl: string | null;
        isFlashSale: boolean;
        flashSaleEndsAt: Date | null;
        size: string | null;
        color: string | null;
        images: string[];
        createdAt: Date;
        updatedAt: Date;
        id: number;
        brandId: number;
        categoryId: number;
        subcategoryId: number | null;
    }) | null>;
    update(id: string, updateProductDto: any): Promise<{
        name: string;
        description: string | null;
        price: number;
        oldPrice: number | null;
        discount: string | null;
        stock: number;
        sold: number;
        rating: number;
        imageUrl: string | null;
        isFlashSale: boolean;
        flashSaleEndsAt: Date | null;
        size: string | null;
        color: string | null;
        images: string[];
        createdAt: Date;
        updatedAt: Date;
        id: number;
        brandId: number;
        categoryId: number;
        subcategoryId: number | null;
    }>;
    remove(id: string): Promise<{
        name: string;
        description: string | null;
        price: number;
        oldPrice: number | null;
        discount: string | null;
        stock: number;
        sold: number;
        rating: number;
        imageUrl: string | null;
        isFlashSale: boolean;
        flashSaleEndsAt: Date | null;
        size: string | null;
        color: string | null;
        images: string[];
        createdAt: Date;
        updatedAt: Date;
        id: number;
        brandId: number;
        categoryId: number;
        subcategoryId: number | null;
    }>;
}
