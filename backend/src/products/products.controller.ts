import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Post()
    create(@Body() createProductDto: any) {
        return this.productsService.create(createProductDto);
    }

    @Get()
    findAll(
        @Query('categoryId') categoryId?: string,
        @Query('brandId') brandId?: string,
        @Query('minPrice') minPrice?: string,
        @Query('maxPrice') maxPrice?: string,
    ) {
        return this.productsService.findAll({
            categoryId: categoryId ? +categoryId : undefined,
            brandId: brandId ? +brandId : undefined,
            minPrice: minPrice ? +minPrice : undefined,
            maxPrice: maxPrice ? +maxPrice : undefined,
        });
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.productsService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateProductDto: any) {
        return this.productsService.update(+id, updateProductDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.productsService.remove(+id);
    }
}
