async function listar(req, res) {
  try {
    const pecas = await req.prisma.peca.findMany({
      orderBy: { nome: 'asc' }
    });
    res.json(pecas);
  } catch (error) {
    console.error('Erro ao listar peças:', error);
    res.status(500).json({ error: 'Erro ao listar peças' });
  }
}

async function criar(req, res) {
  try {
    const { nome, descricao, quantidadeEstoque, precoCusto } = req.body;

    if (!nome) {
      return res.status(400).json({ error: 'Nome é obrigatório' });
    }

    const data = {
      nome,
      descricao,
      quantidadeEstoque: parseInt(quantidadeEstoque) || 0
    };

    if (precoCusto) {
      data.precoCusto = parseFloat(precoCusto);
    }

    const peca = await req.prisma.peca.create({ data });
    res.status(201).json(peca);
  } catch (error) {
    console.error('Erro ao criar peça:', error);
    res.status(500).json({ error: 'Erro ao criar peça' });
  }
}

async function atualizar(req, res) {
  try {
    const { id } = req.params;
    const { nome, descricao, quantidadeEstoque, precoCusto } = req.body;

    const data = {
      nome,
      descricao,
      quantidadeEstoque: parseInt(quantidadeEstoque)
    };

    if (precoCusto !== undefined) {
      data.precoCusto = precoCusto ? parseFloat(precoCusto) : null;
    }

    const peca = await req.prisma.peca.update({
      where: { id },
      data
    });

    res.json(peca);
  } catch (error) {
    console.error('Erro ao atualizar peça:', error);
    res.status(500).json({ error: 'Erro ao atualizar peça' });
  }
}

async function deletar(req, res) {
  try {
    const { id } = req.params;
    await req.prisma.peca.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar peça:', error);
    res.status(500).json({ error: 'Erro ao deletar peça' });
  }
}

module.exports = { listar, criar, atualizar, deletar };