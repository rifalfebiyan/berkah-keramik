import { PrismaService } from '../prisma/prisma.service';
export declare class ProductsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(filters?: {
        categoryId?: number;
        subcategoryId?: number;
        brandId?: number;
        minPrice?: number;
        maxPrice?: number;
        search?: string;
        sort?: string;
        limit?: number;
        page?: number;
    }): Promise<{
        data: ({
            brand: {
                id: number;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                logoUrl: string | null;
            };
            category: {
                id: number;
                name: string;
                imageUrl: string | null;
                createdAt: Date;
                updatedAt: Date;
            };
            subcategory: {
                id: number;
                name: string;
                imageUrl: string | null;
                categoryId: number;
                createdAt: Date;
                updatedAt: Date;
            } | null;
        } & {
            id: number;
            name: string;
            description: string | null;
            price: number;
            oldPrice: number | null;
            discount: string | null;
            stock: number;
            sold: number;
            rating: number;
            imageUrl: string | null;
            brandId: number;
            categoryId: number;
            subcategoryId: number | null;
            isFlashSale: boolean;
            flashSaleEndsAt: Date | null;
            size: string | null;
            color: string | null;
            images: string[];
            createdAt: Date;
            updatedAt: Date;
        })[];
        total: number;
    }>;
    findOne(id: number): Promise<({
        brand: {
            id: number;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            logoUrl: string | null;
        };
        category: {
            id: number;
            name: string;
            imageUrl: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        subcategory: {
            id: number;
            name: string;
            imageUrl: string | null;
            categoryId: number;
            createdAt: Date;
            updatedAt: Date;
        } | null;
    } & {
        id: number;
        name: string;
        description: string | null;
        price: number;
        oldPrice: number | null;
        discount: string | null;
        stock: number;
        sold: number;
        rating: number;
        imageUrl: string | null;
        brandId: number;
        categoryId: number;
        subcategoryId: number | null;
        isFlashSale: boolean;
        flashSaleEndsAt: Date | null;
        size: string | null;
        color: string | null;
        images: string[];
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
    create(data: any): Promise<{
        id: number;
        name: string;
        description: string | null;
        price: number;
        oldPrice: number | null;
        discount: string | null;
        stock: number;
        sold: number;
        rating: number;
        imageUrl: string | null;
        brandId: number;
        categoryId: number;
        subcategoryId: number | null;
        isFlashSale: boolean;
        flashSaleEndsAt: Date | null;
        size: string | null;
        color: string | null;
        images: string[];
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: number, data: any): Promise<{
        id: number;
        name: string;
        description: string | null;
        price: number;
        oldPrice: number | null;
        discount: string | null;
        stock: number;
        sold: number;
        rating: number;
        imageUrl: string | null;
        brandId: number;
        categoryId: number;
        subcategoryId: number | null;
        isFlashSale: boolean;
        flashSaleEndsAt: Date | null;
        size: string | null;
        color: string | null;
        images: string[];
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: number): Promise<{
        id: number;
        name: string;
        description: string | null;
        price: number;
        oldPrice: number | null;
        discount: string | null;
        stock: number;
        sold: number;
        rating: number;
        imageUrl: string | null;
        brandId: number;
        categoryId: number;
        subcategoryId: number | null;
        isFlashSale: boolean;
        flashSaleEndsAt: Date | null;
        size: string | null;
        color: string | null;
        images: string[];
        createdAt: Date;
        updatedAt: Date;
    }>;
}
