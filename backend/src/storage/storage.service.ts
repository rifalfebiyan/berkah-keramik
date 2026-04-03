import { Injectable, OnModuleInit } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';
import sharp from 'sharp';
import { extname } from 'path';

@Injectable()
export class StorageService implements OnModuleInit {
  private supabase: SupabaseClient;
  private supabaseAdmin: SupabaseClient;

  constructor(private configService: ConfigService) {
    const url = this.configService.get<string>('SUPABASE_URL') || '';
    const key = this.configService.get<string>('SUPABASE_KEY') || '';
    const serviceRoleKey = this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY') || '';

    this.supabase = createClient(url, key);

    // Admin client untuk mengatur bucket (perlu service_role key)
    if (serviceRoleKey) {
      this.supabaseAdmin = createClient(url, serviceRoleKey);
    }
  }

  async onModuleInit() {
    // Otomatis pastikan bucket 'products' dan 'categories' ada saat aplikasi start
    await this.ensureBucket('products');
    await this.ensureBucket('categories');
  }

  async ensureBucket(bucket: string) {
    if (!this.supabaseAdmin) return;

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

  async uploadFile(bucket: string, path: string, file: any) {
    await this.ensureBucket(bucket);

    let uploadBuffer = file.buffer;
    let uploadPath = path;
    let uploadMimeType = file.mimetype;

    // Jika file sudah berformat WebP, tidak perlu konversi; langsung upload dengan buffer dan MIME asli

    if (file.mimetype.startsWith('image/') && !file.mimetype.includes('svg+xml') && file.mimetype !== 'image/webp') {
      try {
        uploadBuffer = await sharp(file.buffer).webp({ quality: 80 }).toBuffer();
        uploadMimeType = 'image/webp';

        // Ganti ekstensi file ke .webp
        const extension = extname(path);
        if (extension) {
          uploadPath = path.substring(0, path.lastIndexOf(extension)) + '.webp';
        } else {
          uploadPath = path + '.webp';
        }
      } catch (error) {
        console.error('Error converting image to WebP:', error);
        // Fallback ke file asli jika gagal konversi
      }
    }

    const client = this.supabaseAdmin || this.supabase;
    const { data, error } = await client.storage.from(bucket).upload(uploadPath, uploadBuffer, {
      contentType: uploadMimeType,
      upsert: true,
    });

    if (error) throw error;

    const { data: publicUrlData } = client.storage.from(bucket).getPublicUrl(data.path);
    return publicUrlData.publicUrl;
  }

  async deleteFile(bucket: string, path: string) {
    const client = this.supabaseAdmin || this.supabase;
    const { error } = await client.storage.from(bucket).remove([path]);
    if (error) throw error;
  }
}
