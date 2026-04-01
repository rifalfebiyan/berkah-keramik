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
exports.SubcategoriesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SubcategoriesService = class SubcategoriesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.subcategory.create({
            data,
            include: { category: true },
        });
    }
    async findAll() {
        return this.prisma.subcategory.findMany({
            include: { category: true, products: true },
        });
    }
    async findOne(id) {
        return this.prisma.subcategory.findUnique({
            where: { id },
            include: { category: true, products: true },
        });
    }
    async update(id, data) {
        return this.prisma.subcategory.update({
            where: { id },
            data,
            include: { category: true },
        });
    }
    async remove(id) {
        await this.prisma.product.deleteMany({
            where: { subcategoryId: id },
        });
        return this.prisma.subcategory.delete({
            where: { id },
        });
    }
};
exports.SubcategoriesService = SubcategoriesService;
exports.SubcategoriesService = SubcategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SubcategoriesService);
//# sourceMappingURL=subcategories.service.js.map