import { DeleteProductForm } from '@/components/DeleteButton'
import Sidebar from '@/components/sidebar'
// import { deleteProduct } from '@/lib/actions/products'
import { getCurrentUser } from '@/lib/auth'
import prisma from '@/lib/prisma'

export default async function InventoryPage() {
  const user = await getCurrentUser()

  const totalProduct = await prisma.product.findMany({
    where: {
      userId: user.id,
    },
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar currentPath="/inventory" />
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Inventory
              </h1>
              <p className="text-sm text-gray-500">
                Manage your product and track inventory levels
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Products Tabel */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    SKU
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Low Stock At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white devide-y devide-gray-200">
                {totalProduct.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-500 ">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 ">
                      {product.sku || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 ">
                      $ {Number(product.price).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 ">
                      {product.quantity}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 ">
                      {product.lowStockAt || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 ">
                      {/* Простой вариант вызова серверной функции */}
                      {/* <form
                        action={async (formData: FormData) => {
                          //! Вызов серверной функции
                          'use server'
                          await deleteProduct(formData)
                        }}
                      >
                        <input type="hidden" name="id" value={product.id} />
                        <button className="text-red-600 hover:text-red-900">
                          Delete
                        </button>
                      </form> */}

                      {/* Вызов серверной функции в клиентском компоненте с отслеживание состояния выполнения */}
                      <DeleteProductForm productId={product.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
