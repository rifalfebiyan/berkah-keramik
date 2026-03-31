import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BrandsService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return this.prisma.brand.findMany({
            include: { products: true },
        });
    }

    async findOne(id: number) {
        return this.prisma.brand.findUnique({
            where: { id },
            include: { products: true },
        });
    }

    async create(data: any) {
        return this.prisma.brand.create({ data });
    }

    async update(id: number, data: any) {
        return this.prisma.brand.update({
            where: { id },
            data,
        });
    }

    async remove(id: number) {
        return this.prisma.brand.delete({ where: { id } });
    }
}
