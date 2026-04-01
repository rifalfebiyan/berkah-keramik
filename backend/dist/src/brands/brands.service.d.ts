import { PrismaService } from '../prisma/prisma.service';
export declare class BrandsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<({
        products: {
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
        }[];
    } & {
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        logoUrl: string | null;
    })[]>;
    findOne(id: number): Promise<({
        products: {
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
        }[];
    } & {
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        logoUrl: string | null;
    }) | null>;
    create(data: any): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        logoUrl: string | null;
    }>;
    update(id: number, data: any): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        logoUrl: string | null;
    }>;
    remove(id: number): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        logoUrl: string | null;
    }>;
}
