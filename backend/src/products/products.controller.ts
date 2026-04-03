import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'SUPERADMIN')
    create(@Body() createProductDto: any) {
        return this.productsService.create(createProductDto);
    }

    @Get()
    findAll(
        @Query('categoryId') categoryId?: string,
        @Query('subcategoryId') subcategoryId?: string,
        @Query('brandId') brandId?: string,
        @Query('minPrice') minPrice?: string,
        @Query('maxPrice') maxPrice?: string,
        @Query('search') search?: string,
        @Query('sort') sort?: string,
    ) {
        return this.productsService.findAll({
            categoryId: categoryId ? +categoryId : undefined,
            subcategoryId: subcategoryId ? +subcategoryId : undefined,
            brandId: brandId ? +brandId : undefined,
            minPrice: minPrice ? +minPrice : undefined,
            maxPrice: maxPrice ? +maxPrice : undefined,
            search,
            sort,
        });
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.productsService.findOne(+id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'SUPERADMIN')
    update(@Param('id') id: string, @Body() updateProductDto: any) {
        return this.productsService.update(+id, updateProductDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'SUPERADMIN')
    remove(@Param('id') id: string) {
        return this.productsService.remove(+id);
    }
}
