const bcrypt = require('bcryptjs');

async function listar(req, res) {
  try {
    const clientes = await req.prisma.cliente.findMany({
      orderBy: { nome: 'asc' }
    });
    res.json(clientes);
  } catch (error) {
    console.error('Erro ao listar clientes:', error);
    res.status(500).json({ error: 'Erro ao listar clientes' });
  }
}

async function criar(req, res) {
  try {
    const { nome, telefone, email, senha } = req.body;

    if (!nome || !telefone) {
      return res.status(400).json({ error: 'Nome e telefone são obrigatórios' });
    }

    const data = { nome, telefone, email };

    if (email && senha) {
      const senhaHash = await bcrypt.hash(senha, 10);
      data.senhaHash = senhaHash;
    }

    const cliente = await req.prisma.cliente.create({ data });
    res.status(201).json(cliente);
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    res.status(500).json({ error: 'Erro ao criar cliente' });
  }
}

async function atualizar(req, res) {
  try {
    const { id } = req.params;
    const { nome, telefone, email, senha } = req.body;

    const data = { nome, telefone, email };

    if (senha) {
      const senhaHash = await bcrypt.hash(senha, 10);
      data.senhaHash = senhaHash;
    }

    const cliente = await req.prisma.cliente.update({
      where: { id },
      data
    });

    res.json(cliente);
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error);
    res.status(500).json({ error: 'Erro ao atualizar cliente' });
  }
}

async function deletar(req, res) {
  try {
    const { id } = req.params;
    await req.prisma.cliente.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar cliente:', error);
    res.status(500).json({ error: 'Erro ao deletar cliente' });
  }
}

module.exports = { listar, criar, atualizar, deletar };