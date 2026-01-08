const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
  __internal: {
    debug: false
  }
});

// Handle connection pooling for better performance
if (process.env.NODE_ENV === 'production') {
  prisma.$use(async (params, next) => {
    return next(params);
  });
}

module.exports = prisma;
