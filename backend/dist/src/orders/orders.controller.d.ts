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
        createdAt: Date;
        updatedAt: Date;
        customer: string;
        phone: string | null;
        address: string | null;
        total: number;
        status: string;
        date: string;
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
        createdAt: Date;
        updatedAt: Date;
        customer: string;
        phone: string | null;
        address: string | null;
        total: number;
        status: string;
        date: string;
    })[]>;
}
