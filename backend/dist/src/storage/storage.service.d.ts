import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export declare class StorageService implements OnModuleInit {
    private configService;
    private supabase;
    private supabaseAdmin;
    constructor(configService: ConfigService);
    onModuleInit(): Promise<void>;
    ensureBucket(bucket: string): Promise<void>;
    uploadFile(bucket: string, path: string, file: any): Promise<string>;
    deleteFile(bucket: string, path: string): Promise<void>;
}
