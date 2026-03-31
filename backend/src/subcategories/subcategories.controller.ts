import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SubcategoriesService } from './subcategories.service';
import { Prisma } from '@prisma/client';

@Controller('subcategories')
export class SubcategoriesController {
  constructor(private readonly subcategoriesService: SubcategoriesService) {}

  @Post()
  create(@Body() data: any) {
    const { categoryId, ...rest } = data;
    return this.subcategoriesService.create({
      ...rest,
      category: { connect: { id: +categoryId } }
    });
  }

  @Get()
  findAll() {
    return this.subcategoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subcategoriesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    const { categoryId, ...rest } = data;
    const updateData: any = { ...rest };
    if (categoryId) {
      updateData.category = { connect: { id: +categoryId } };
    }
    return this.subcategoriesService.update(+id, updateData);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subcategoriesService.remove(+id);
  }
}
