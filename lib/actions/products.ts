'use server'
import { getCurrentUser } from '../auth'
import prisma from '../prisma'

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
