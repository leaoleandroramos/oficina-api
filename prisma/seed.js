
// require("dotenv").config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');


// console.log("DATABASE_URL:", process.env.DATABASE_URL);

const prisma = new PrismaClient();

(async () => {
  const count = await prisma.cliente.count();
  console.log("Total de clientes:", count);
  await prisma.$disconnect();
})();

async function main() {
  // Criar tenant de exemplo
  const tenant = await prisma.tenant.create({
    data: {
      nome: 'Oficina Demo',
      plano: 'pro',
      status: 'ativo'
    }
  });

  // Criar usuário admin
  const senhaHash = await bcrypt.hash('admin123', 10);
  await prisma.user.create({
    data: {
      tenantId: tenant.id,
      nome: 'Administrador',
      email: 'admin@oficina.com',
      senhaHash,
      role: 'admin'
    }
  });

  // Criar cliente de exemplo
  const senhaClienteHash = await bcrypt.hash('cliente123', 10);
  const cliente = await prisma.cliente.create({
    data: {
      tenantId: tenant.id,
      nome: 'João Silva',
      telefone: '(21) 99999-9999',
      email: 'cliente@example.com',
      senhaHash: senhaClienteHash
    }
  });

  // Criar veículo
  await prisma.veiculo.create({
    data: {
      tenantId: tenant.id,
      clienteId: cliente.id,
      placa: 'ABC-1234',
      modelo: 'Honda Civic',
      ano: 2020
    }
  });

  console.log('✅ Seed concluído com sucesso!');
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());