import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  async listFavorites(userId: number) {
    const favorites = await this.prisma.favorite.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            brand: true,
            category: true,
            subcategory: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return favorites.map((f) => f.product);
  }

  async toggleFavorite(userId: number, productId: number) {
    // Check if product exists
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Produk tidak ditemukan');
    }

    // Check if already favorited
    const existing = await this.prisma.favorite.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (existing) {
      // Remove from favorites
      await this.prisma.favorite.delete({
        where: { id: existing.id },
      });
      return { favorited: false };
    } else {
      // Add to favorites
      await this.prisma.favorite.create({
        data: {
          userId,
          productId,
        },
      });
      return { favorited: true };
    }
  }

  async isFavorited(userId: number, productId: number) {
    const favorite = await this.prisma.favorite.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });
    return !!favorite;
  }
}
