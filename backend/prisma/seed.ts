import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Mulai seeding...')

    // Buat Brand
    const brands = ['MULIA', 'SHARP', 'LG', 'RINNAI', 'PANFILA', 'GEA', 'MODENA']
    for (const name of brands) {
        await prisma.brand.upsert({
            where: { name },
            update: {},
            create: { name },
        })
    }

    const brandRecords = await prisma.brand.findMany()
    const brandMap = Object.fromEntries(brandRecords.map((b) => [b.name, b.id]))

    // Buat Kategori
    const categoryNames = ['Keramik', 'Elektronik', 'Peralatan Dapur']
    for (const name of categoryNames) {
        await prisma.category.upsert({
            where: { id: categoryNames.indexOf(name) + 1 }, // Simple ID mapping
            update: {},
            create: { name },
        })
    }

    const categories = await prisma.category.findMany()
    const keramikId = categories.find(c => c.name === 'Keramik')?.id || 1
    const elektronikId = categories.find(c => c.name === 'Elektronik')?.id || 2
    const dapurId = categories.find(c => c.name === 'Peralatan Dapur')?.id || 3

    // Data Produk
    const products = [
        { 
            name: 'SIGNATURE CERAMIC 40X40 FT SANDSTONE', 
            brand: 'PANFILA', 
            price: 65500, 
            oldPrice: 85000, 
            discount: '23%', 
            sold: 42, 
            categoryId: keramikId,
            imageUrl: 'https://images.unsplash.com/photo-1588854337221-4cf9fa96059c?auto=format&fit=crop&q=80&w=400',
            isFlashSale: true,
            flashSaleEndsAt: new Date(Date.now() + 5 * 60 * 60 * 1000) // 5 jam dari sekarang
        },
        { 
            name: 'Fressia White High Gloss', 
            brand: 'MULIA', 
            price: 52000, 
            oldPrice: 65000, 
            discount: '20%', 
            sold: 156, 
            categoryId: keramikId,
            imageUrl: 'https://images.unsplash.com/photo-1545173168-9f1947eebb9f?auto=format&fit=crop&q=80&w=400',
            isFlashSale: false
        },
        { 
            name: 'LG FRONT LOAD WM FV1285S3VS', 
            brand: 'LG', 
            price: 6397015, 
            oldPrice: null, 
            discount: null, 
            sold: 5, 
            categoryId: elektronikId,
            imageUrl: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&q=80&w=400',
            isFlashSale: false
        },
        { 
            name: 'SHARP SEMI AUTO WM EST75NTPK', 
            brand: 'SHARP', 
            price: 1350000, 
            oldPrice: 1554737, 
            discount: '13%', 
            sold: 22, 
            categoryId: elektronikId,
            imageUrl: 'https://images.unsplash.com/photo-1563298723-dcfebaa392e3?auto=format&fit=crop&q=80&w=400',
            isFlashSale: true,
            flashSaleEndsAt: new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 jam dari sekarang
        },
        { 
            name: 'MODENA Kitchen Hood Slim Type', 
            brand: 'MODENA', 
            price: 1850000, 
            oldPrice: 2100000, 
            discount: '12%', 
            sold: 8, 
            categoryId: dapurId,
            imageUrl: 'https://images.unsplash.com/photo-1556911220-e150213ff167?auto=format&fit=crop&q=80&w=400',
            isFlashSale: false
        },
    ]

    for (const p of products) {
        await prisma.product.create({
            data: {
                name: p.name,
                price: p.price,
                oldPrice: p.oldPrice,
                discount: p.discount,
                sold: p.sold,
                imageUrl: p.imageUrl,
                isFlashSale: p.isFlashSale,
                flashSaleEndsAt: p.flashSaleEndsAt,
                brandId: brandMap[p.brand] || brandRecords[0].id,
                categoryId: p.categoryId,
            }
        })
    }

    console.log('Seeding selesai!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
