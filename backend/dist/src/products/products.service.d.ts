import { PrismaService } from '../prisma/prisma.service';
export declare class ProductsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(filters?: {
        categoryId?: number;
        brandId?: number;
        minPrice?: number;
        maxPrice?: number;
    }): Promise<({
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
    findOne(id: number): Promise<({
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
    create(data: any): Promise<{
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
    update(id: number, data: any): Promise<{
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
    remove(id: number): Promise<{
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
