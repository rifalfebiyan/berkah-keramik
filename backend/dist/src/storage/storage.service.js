"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageService = void 0;
const common_1 = require("@nestjs/common");
const supabase_js_1 = require("@supabase/supabase-js");
const config_1 = require("@nestjs/config");
const sharp_1 = __importDefault(require("sharp"));
const path_1 = require("path");
let StorageService = class StorageService {
    configService;
    supabase;
    supabaseAdmin;
    constructor(configService) {
        this.configService = configService;
        const url = this.configService.get('SUPABASE_URL') || '';
        const key = this.configService.get('SUPABASE_KEY') || '';
        const serviceRoleKey = this.configService.get('SUPABASE_SERVICE_ROLE_KEY') || '';
        this.supabase = (0, supabase_js_1.createClient)(url, key);
        if (serviceRoleKey) {
            this.supabaseAdmin = (0, supabase_js_1.createClient)(url, serviceRoleKey);
        }
    }
    async onModuleInit() {
        await this.ensureBucket('products');
        await this.ensureBucket('categories');
    }
    async ensureBucket(bucket) {
        if (!this.supabaseAdmin)
            return;
        const { data: buckets, error: listError } = await this.supabaseAdmin.storage.listBuckets();
        if (listError) {
            console.error(`Error listing buckets: ${listError.message}`);
            return;
        }
        const bucketExists = buckets.find((b) => b.name === bucket);
        if (!bucketExists) {
            console.log(`Creating bucket: ${bucket}`);
            const { error: createError } = await this.supabaseAdmin.storage.createBucket(bucket, {
                public: true,
            });
            if (createError) {
                console.error(`Error creating bucket ${bucket}: ${createError.message}`);
            }
        }
    }
    async uploadFile(bucket, path, file) {
        await this.ensureBucket(bucket);
        let uploadBuffer = file.buffer;
        let uploadPath = path;
        let uploadMimeType = file.mimetype;
        if (file.mimetype.startsWith('image/') && !file.mimetype.includes('svg+xml')) {
            try {
                uploadBuffer = await (0, sharp_1.default)(file.buffer)
                    .webp({ quality: 80 })
                    .toBuffer();
                uploadMimeType = 'image/webp';
                const extension = (0, path_1.extname)(path);
                if (extension) {
                    uploadPath = path.substring(0, path.lastIndexOf(extension)) + '.webp';
                }
                else {
                    uploadPath = path + '.webp';
                }
            }
            catch (error) {
                console.error('Error converting image to WebP:', error);
            }
        }
        const client = this.supabaseAdmin || this.supabase;
        const { data, error } = await client.storage
            .from(bucket)
            .upload(uploadPath, uploadBuffer, {
            contentType: uploadMimeType,
            upsert: true,
        });
        if (error)
            throw error;
        const { data: publicUrlData } = client.storage
            .from(bucket)
            .getPublicUrl(data.path);
        return publicUrlData.publicUrl;
    }
    async deleteFile(bucket, path) {
        const client = this.supabaseAdmin || this.supabase;
        const { error } = await client.storage.from(bucket).remove([path]);
        if (error)
            throw error;
    }
};
exports.StorageService = StorageService;
exports.StorageService = StorageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], StorageService);
//# sourceMappingURL=storage.service.js.map