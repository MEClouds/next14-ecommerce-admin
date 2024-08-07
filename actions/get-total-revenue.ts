import prismadb from "@/lib/prismadb"
import { Order, OrderItem } from "@prisma/client"

export const getTotalRevenue = async (storeId: string) => {
  const paidOrders = await prismadb.order.findMany({
    where: {
      storeId,
      isPaid: true,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  })

  const totalRevenue = paidOrders.reduce((total: number, order: Order) => {
    const totalOrder = order.orderItems.reduce(
      (orderSum: number, item: OrderItem) => {
        return orderSum + item.product.price.toNumber()
      },
      0
    )
    return total + totalOrder
  }, 0)
  return totalRevenue
}
