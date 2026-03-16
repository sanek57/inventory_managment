'use client'

import { deleteProductUseAction } from '@/lib/actions/products'
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import { useActionState } from 'react'

// тип состояния (что возвращает действие)
type DeleteState = { success: boolean; message?: string; error?: string } | null

export function DeleteProductForm({ productId }: { productId: string }) {
  const [state, formAction, isPending] = useActionState<DeleteState, FormData>(
    deleteProductUseAction,
    null
  )

  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={productId} />

      <button
        type="submit"
        disabled={isPending}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium
          transition-colors
          ${
            isPending
              ? 'bg-gray-300 text-gray-500 cursor-wait'
              : 'bg-red-600 hover:bg-red-900 text-white'
          }
        `}
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Deleting...
          </>
        ) : (
          'Delete'
        )}
      </button>

      {state && (
        <div className="mt-3 text-sm flex items-center gap-2">
          {state.success ? (
            <>
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <span className="text-green-700">{state.message}</span>
            </>
          ) : state.error ? (
            <>
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="text-red-700">{state.error}</span>
            </>
          ) : null}
        </div>
      )}
    </form>
  )
}
