import { Controller, Post, UseInterceptors, UploadedFile, BadRequestException, Body, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from './storage.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('upload')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Body('bucket') bucketBody?: string) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    try {
      // Menentukan bucket (default 'products')
      const bucket = bucketBody || 'products';
      const fileName = `${Date.now()}-${file.originalname}`;
      const path = fileName;

      const url = await this.storageService.uploadFile(bucket, path, file);
      return { url };
    } catch (error) {
      console.error('Upload error:', error);
      throw new BadRequestException(`Upload failed: ${error.message}`);
    }
  }
}
