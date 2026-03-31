import { PrismaService } from '../prisma/prisma.service';
export declare class OrdersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<({
        items: {
            id: number;
            total: number;
            productName: string;
            pricePerUnit: number;
            quantity: number;
            orderId: number;
        }[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        customer: string;
        phone: string | null;
        address: string | null;
        total: number;
        status: string;
        date: string;
    })[]>;
    create(data: any): Promise<{
        items: {
            id: number;
            total: number;
            productName: string;
            pricePerUnit: number;
            quantity: number;
            orderId: number;
        }[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        customer: string;
        phone: string | null;
        address: string | null;
        total: number;
        status: string;
        date: string;
    }>;
}
