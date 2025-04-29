const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class OrderService {
  async createOrder(userId, orderData) {
    return await prisma.order.create({
      data: {
        userId,
        ...orderData,
        orderItems: {
          create: orderData.orderItems
        }
      }
    });
  }

  async getOrderById(id) {
    return await prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: {
          include: {
            dish: true
          }
        },
        user: true
      }
    });
  }

  async getUserOrders(userId) {
    return await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        orderItems: {
          include: {
            dish: true
          }
        }
      }
    });
  }

  async updateOrderStatus(id, status) {
    return await prisma.order.update({
      where: { id },
      data: { status }
    });
  }

  async cancelOrder(id, reason) {
    return await prisma.order.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        notes: reason
      }
    });
  }

  async addReview(orderId, userId, reviewData) {
    return await prisma.review.create({
      data: {
        orderId,
        userId,
        ...reviewData
      }
    });
  }
}

module.exports = new OrderService();