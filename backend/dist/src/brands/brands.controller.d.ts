import { BrandsService } from './brands.service';
export declare class BrandsController {
    private readonly brandsService;
    constructor(brandsService: BrandsService);
    create(createBrandDto: any): Promise<{
        id: number;
        name: string;
        logoUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
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
    } & {
        id: number;
        name: string;
        logoUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findOne(id: string): Promise<({
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
    } & {
        id: number;
        name: string;
        logoUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
    update(id: string, updateBrandDto: any): Promise<{
        id: number;
        name: string;
        logoUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        id: number;
        name: string;
        logoUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
