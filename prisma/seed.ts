import { Prisma } from '@/lib/generated/prisma/client'
import prisma from '@/lib/prisma'
import 'dotenv/config'

// Seed - начальные данные для заполнения БД

export async function main() {
  const userId = '46b08d7c-9605-4e92-b72c-a3a553eca2f9'

  await prisma.product.createMany({
    data: Array.from({ length: 25 }).map((_, i) => ({
      userId,
      name: `Product ${i + 1}`,
      price: (Math.random() * 90 + 10).toFixed(2),
      quantity: Math.floor(Math.random() * 20),
      lowStockAt: Math.floor(Math.random() * 10),
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * (i * 5)),
    })),
  })

  console.log('Seed data created seccessfully!')
  console.log('Created 25 products for user ID:', userId)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
