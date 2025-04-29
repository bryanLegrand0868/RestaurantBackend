const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

class UserService {
  async createUser(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    return await prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword
      }
    });
  }

  async getUserById(id) {
    return await prisma.user.findUnique({
      where: { id }
    });
  }

  async getUserByEmail(email) {
    return await prisma.user.findUnique({
      where: { email }
    });
  }

  async updateUser(id, userData) {
    return await prisma.user.update({
      where: { id },
      data: userData
    });
  }

  async deleteUser(id) {
    return await prisma.user.delete({
      where: { id }
    });
  }

  async verifyPassword(user, password) {
    return await bcrypt.compare(password, user.password);
  }
}

module.exports = new UserService();