import { BrandsService } from './brands.service';
export declare class BrandsController {
    private readonly brandsService;
    constructor(brandsService: BrandsService);
    create(createBrandDto: any): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        logoUrl: string | null;
    }>;
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
            images: string[];
        }[];
    } & {
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        logoUrl: string | null;
    })[]>;
    findOne(id: string): Promise<({
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
            images: string[];
        }[];
    } & {
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        logoUrl: string | null;
    }) | null>;
    update(id: string, updateBrandDto: any): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        logoUrl: string | null;
    }>;
    remove(id: string): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        logoUrl: string | null;
    }>;
}
