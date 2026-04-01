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
    }): Promise<({
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
        categoryId: number;
        subcategoryId: number | null;
        description: string | null;
        price: number;
        oldPrice: number | null;
        discount: string | null;
        stock: number;
        sold: number;
        rating: number;
        brandId: number;
        isFlashSale: boolean;
        flashSaleEndsAt: Date | null;
        size: string | null;
        color: string | null;
    })[]>;
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
        categoryId: number;
        subcategoryId: number | null;
        description: string | null;
        price: number;
        oldPrice: number | null;
        discount: string | null;
        stock: number;
        sold: number;
        rating: number;
        brandId: number;
        isFlashSale: boolean;
        flashSaleEndsAt: Date | null;
        size: string | null;
        color: string | null;
    }) | null>;
    create(data: any): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        imageUrl: string | null;
        categoryId: number;
        subcategoryId: number | null;
        description: string | null;
        price: number;
        oldPrice: number | null;
        discount: string | null;
        stock: number;
        sold: number;
        rating: number;
        brandId: number;
        isFlashSale: boolean;
        flashSaleEndsAt: Date | null;
        size: string | null;
        color: string | null;
    }>;
    update(id: number, data: any): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        imageUrl: string | null;
        categoryId: number;
        subcategoryId: number | null;
        description: string | null;
        price: number;
        oldPrice: number | null;
        discount: string | null;
        stock: number;
        sold: number;
        rating: number;
        brandId: number;
        isFlashSale: boolean;
        flashSaleEndsAt: Date | null;
        size: string | null;
        color: string | null;
    }>;
    remove(id: number): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        imageUrl: string | null;
        categoryId: number;
        subcategoryId: number | null;
        description: string | null;
        price: number;
        oldPrice: number | null;
        discount: string | null;
        stock: number;
        sold: number;
        rating: number;
        brandId: number;
        isFlashSale: boolean;
        flashSaleEndsAt: Date | null;
        size: string | null;
        color: string | null;
    }>;
}
