import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    getProtected(req: any): {
        message: string;
        user: any;
    };
    register(body: {
        email: string;
        password: string;
        name: string;
    }): Promise<{
        email: string;
        name: string | null;
        password: string;
        role: string;
        provider: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }>;
    loginInfo(): {
        message: string;
    };
    login(body: {
        email: string;
        password: string;
    }): Promise<{
        message: string;
        access_token?: undefined;
        role?: undefined;
        name?: undefined;
    } | {
        access_token: string;
        role: string;
        name: string | null;
        message?: undefined;
    }>;
    googleAuth(req: any): Promise<void>;
    googleAuthRedirect(req: any, res: any): Promise<any>;
}
