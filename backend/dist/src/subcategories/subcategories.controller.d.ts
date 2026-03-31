import { SubcategoriesService } from './subcategories.service';
export declare class SubcategoriesController {
    private readonly subcategoriesService;
    constructor(subcategoriesService: SubcategoriesService);
    create(data: any): Promise<{
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
    update(id: string, data: any): Promise<{
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
    remove(id: string): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        imageUrl: string | null;
        categoryId: number;
    }>;
}
