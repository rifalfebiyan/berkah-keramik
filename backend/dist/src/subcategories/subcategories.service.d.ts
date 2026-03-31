import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
export declare class SubcategoriesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.SubcategoryCreateInput): Promise<{
        category: {
            id: number;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            imageUrl: string | null;
        };
    } & {
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        imageUrl: string | null;
        categoryId: number;
    }>;
    findAll(): Promise<({
        products: {
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
        }[];
        category: {
            id: number;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            imageUrl: string | null;
        };
    } & {
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        imageUrl: string | null;
        categoryId: number;
    })[]>;
    findOne(id: number): Promise<({
        products: {
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
        }[];
        category: {
            id: number;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            imageUrl: string | null;
        };
    } & {
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        imageUrl: string | null;
        categoryId: number;
    }) | null>;
    update(id: number, data: Prisma.SubcategoryUpdateInput): Promise<{
        category: {
            id: number;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            imageUrl: string | null;
        };
    } & {
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        imageUrl: string | null;
        categoryId: number;
    }>;
    remove(id: number): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        imageUrl: string | null;
        categoryId: number;
    }>;
}
