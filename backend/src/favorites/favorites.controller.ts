import { Controller, Get, Post, Param, UseGuards, Request, Delete } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('favorites')
@UseGuards(JwtAuthGuard)
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  async getFavorites(@Request() req) {
    const userId = Number(req.user.sub);
    return this.favoritesService.listFavorites(userId);
  }

  @Post(':productId')
  async toggleFavorite(@Request() req, @Param('productId') productId: string) {
    const userId = Number(req.user.sub);
    return this.favoritesService.toggleFavorite(userId, Number(productId));
  }

  @Get('check/:productId')
  async isFavorited(@Request() req, @Param('productId') productId: string) {
    const userId = Number(req.user.sub);
    return this.favoritesService.isFavorited(userId, Number(productId));
  }
}
