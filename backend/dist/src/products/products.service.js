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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ProductsService = class ProductsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(filters) {
        let orderBy = { createdAt: 'desc' };
        if (filters?.sort === 'price_asc') {
            orderBy = { price: 'asc' };
        }
        else if (filters?.sort === 'price_desc') {
            orderBy = { price: 'desc' };
        }
        else if (filters?.sort === 'relevance') {
            orderBy = { id: 'desc' };
        }
        else if (filters?.sort === 'latest') {
            orderBy = { createdAt: 'desc' };
        }
        return this.prisma.product.findMany({
            where: {
                categoryId: filters?.categoryId,
                subcategoryId: filters?.subcategoryId,
                brandId: filters?.brandId,
                price: {
                    gte: filters?.minPrice,
                    lte: filters?.maxPrice,
                },
                OR: filters?.search ? [
                    { name: { contains: filters.search, mode: 'insensitive' } },
                    { description: { contains: filters.search, mode: 'insensitive' } },
                ] : undefined,
            },
            include: { category: true, brand: true, subcategory: true },
            orderBy,
        });
    }
    async findOne(id) {
        return this.prisma.product.findUnique({
            where: { id },
            include: { category: true, brand: true, subcategory: true },
        });
    }
    async create(data) {
        return this.prisma.product.create({ data });
    }
    async update(id, data) {
        return this.prisma.product.update({
            where: { id },
            data,
        });
    }
    async remove(id) {
        return this.prisma.product.delete({ where: { id } });
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductsService);
//# sourceMappingURL=products.service.js.map