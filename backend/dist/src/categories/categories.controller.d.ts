import { CategoriesService } from './categories.service';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    create(createCategoryDto: any): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        imageUrl: string | null;
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
        createdAt: Date;
        updatedAt: Date;
        imageUrl: string | null;
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
        createdAt: Date;
        updatedAt: Date;
        imageUrl: string | null;
    }) | null>;
    update(id: string, updateCategoryDto: any): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        imageUrl: string | null;
    }>;
    remove(id: string): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        imageUrl: string | null;
    }>;
}
