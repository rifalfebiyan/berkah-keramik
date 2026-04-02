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
        phone: string | null;
        address: string | null;
        createdAt: Date;
        updatedAt: Date;
        customer: string;
        total: number;
        status: string;
        date: string;
        userId: number | null;
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
        phone: string | null;
        address: string | null;
        createdAt: Date;
        updatedAt: Date;
        customer: string;
        total: number;
        status: string;
        date: string;
        userId: number | null;
    }>;
    findByUserId(userId: number): Promise<({
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
        phone: string | null;
        address: string | null;
        createdAt: Date;
        updatedAt: Date;
        customer: string;
        total: number;
        status: string;
        date: string;
        userId: number | null;
    })[]>;
}
