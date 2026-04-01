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
