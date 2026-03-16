'use server'
import z from 'zod'
import { getCurrentUser } from '../auth'
import prisma from '../prisma'
import { redirect } from 'next/navigation'

//! Серверные функции для продуктов

//* Простая серверная функция - без отследивания состояния
export async function deleteProduct(formData: FormData) {
  const user = await getCurrentUser()
  const id = String(formData.get('id') || '')

  await prisma.product.deleteMany({
    where: { id: id, userId: user.id },
  })
}

//* Серверная функция - с отслеживанием состояния в клиентском компоненте
type DeleteState = { success: boolean; message?: string; error?: string } | null

export async function deleteProductUseAction(
  prevState: DeleteState,
  formData: FormData
): Promise<DeleteState> {
  const user = await getCurrentUser()

  const id = formData.get('id') as string

  if (!id) {
    return { success: false, error: 'ID product not define' }
  }

  try {
    await prisma.product.deleteMany({
      where: { id: id, userId: user.id },
    })
    return { success: true, message: 'The product has been removed.' }
  } catch (error) {
    console.log('Failed to delete product', error)
    return { success: false, error: 'Failed to delete item' }
  }
}

const ProductSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  price: z.coerce.number().nonnegative('Price must be non-negative'),
  quantity: z.coerce.number().int().min(0, 'Quantity must be non-negative'),
  sku: z.string().optional(),
  lowStockAt: z.coerce.number().int().min(0).optional(),
})

//* Создание продукта
export async function createProduct(formData: FormData) {
  const user = await getCurrentUser()

  const parsed = ProductSchema.safeParse({
    name: formData.get('name'),
    price: formData.get('price'),
    quantity: formData.get('quantity'),
    sku: formData.get('sku') || undefined,
    lowStockAt: formData.get('lowStockAt') || undefined,
  })

  if (!parsed.success) {
    throw new Error('Validation failed')
  }

  try {
    await prisma.product.create({
      data: {
        ...parsed.data,
        userId: user.id,
      },
    })
    redirect('/inventory')
  } catch (error) {
    throw new Error('Failed to create product')
  }
}
