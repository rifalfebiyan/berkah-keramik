import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
export declare class AuthService {
    private jwtService;
    private prisma;
    constructor(jwtService: JwtService, prisma: PrismaService);
    register(email: string, password: string, name: string): Promise<{
        id: number;
        email: string;
        name: string | null;
        password: string;
        phone: string | null;
        address: string | null;
        provider: string;
        createdAt: Date;
        updatedAt: Date;
        role: import(".prisma/client").$Enums.Role;
    }>;
    login(email: string, password: string): Promise<{
        message: string;
        access_token?: undefined;
        role?: undefined;
        name?: undefined;
    } | {
        access_token: string;
        role: import(".prisma/client").$Enums.Role;
        name: string | null;
        message?: undefined;
    }>;
    validateGoogleUser(details: any): Promise<{
        access_token: string;
        role: import(".prisma/client").$Enums.Role;
        name: string | null;
    }>;
}
