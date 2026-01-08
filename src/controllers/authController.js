const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwt');
const prisma = require('../config/database');

async function login(req, res) {
  try {
    const { email, password, isCliente } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    if (isCliente) {
      const cliente = await prisma.cliente.findFirst({
        where: { email },
        include: { tenant: true }
      });

      if (!cliente || !cliente.senhaHash) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      const isValid = await bcrypt.compare(password, cliente.senhaHash);
      if (!isValid) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      const token = generateToken({
        id: cliente.id,
        tenantId: cliente.tenantId,
        role: 'cliente',
        email: cliente.email
      });

      return res.json({
        token,
        user: {
          id: cliente.id,
          nome: cliente.nome,
          email: cliente.email,
          role: 'cliente',
          tenantId: cliente.tenantId
        }
      });
    }

    const user = await prisma.user.findFirst({
      where: { email },
      include: { tenant: true }
    });

    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const isValid = await bcrypt.compare(password, user.senhaHash);
    if (!isValid) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const token = generateToken({
      id: user.id,
      tenantId: user.tenantId,
      role: user.role,
      email: user.email
    });

    res.json({
      token,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId,
        tenant: user.tenant.nome
      }
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
}

async function register(req, res) {
  try {
    const { nome, email, password, nomeOficina } = req.body;

    if (!nome || !email || !password || !nomeOficina) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    const existingUser = await prisma.user.findFirst({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    const senhaHash = await bcrypt.hash(password, 10);

    const tenant = await prisma.tenant.create({
      data: {
        nome: nomeOficina,
        plano: 'basic',
        status: 'ativo'
      }
    });

    const user = await prisma.user.create({
      data: {
        tenantId: tenant.id,
        nome,
        email,
        senhaHash,
        role: 'admin'
      }
    });

    const token = generateToken({
      id: user.id,
      tenantId: user.tenantId,
      role: user.role,
      email: user.email
    });

    res.status(201).json({
      token,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId,
        tenant: tenant.nome
      }
    });
  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({ error: 'Erro ao criar conta' });
  }
}

module.exports = { login, register };