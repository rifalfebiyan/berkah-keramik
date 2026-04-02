import { OrdersService } from './orders.service';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(createOrderDto: any): Promise<{
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
    getMyOrders(req: any): Promise<({
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
