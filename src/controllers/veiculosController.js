async function listar(req, res) {
  try {
    const veiculos = await req.prisma.veiculo.findMany({
      include: { cliente: { select: { nome: true } } },
      orderBy: { placa: 'asc' }
    });
    res.json(veiculos);
  } catch (error) {
    console.error('Erro ao listar veículos:', error);
    res.status(500).json({ error: 'Erro ao listar veículos' });
  }
}

async function listarPorCliente(req, res) {
  try {
    const { clienteId } = req.params;
    const veiculos = await req.prisma.veiculo.findMany({
      where: { clienteId },
      orderBy: { modelo: 'asc' }
    });
    res.json(veiculos);
  } catch (error) {
    console.error('Erro ao listar veículos do cliente:', error);
    res.status(500).json({ error: 'Erro ao listar veículos' });
  }
}

async function criar(req, res) {
  try {
    const { clienteId, placa, modelo, ano } = req.body;

    if (!clienteId || !placa || !modelo || !ano) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    const veiculo = await req.prisma.veiculo.create({
      data: { clienteId, placa, modelo, ano: parseInt(ano) },
      include: { cliente: { select: { nome: true } } }
    });

    res.status(201).json(veiculo);
  } catch (error) {
    console.error('Erro ao criar veículo:', error);
    res.status(500).json({ error: 'Erro ao criar veículo' });
  }
}

async function atualizar(req, res) {
  try {
    const { id } = req.params;
    const { clienteId, placa, modelo, ano } = req.body;

    const veiculo = await req.prisma.veiculo.update({
      where: { id },
      data: { clienteId, placa, modelo, ano: parseInt(ano) },
      include: { cliente: { select: { nome: true } } }
    });

    res.json(veiculo);
  } catch (error) {
    console.error('Erro ao atualizar veículo:', error);
    res.status(500).json({ error: 'Erro ao atualizar veículo' });
  }
}

async function deletar(req, res) {
  try {
    const { id } = req.params;
    await req.prisma.veiculo.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar veículo:', error);
    res.status(500).json({ error: 'Erro ao deletar veículo' });
  }
}

module.exports = { listar, listarPorCliente, criar, atualizar, deletar };