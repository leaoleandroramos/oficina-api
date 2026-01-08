async function listar(req, res) {
  try {
    const ordens = await req.prisma.ordemServico.findMany({
      include: {
        cliente: { select: { nome: true } },
        veiculo: { select: { placa: true, modelo: true } },
        itens: {
          include: {
            peca: { select: { nome: true } }
          }
        }
      },
      orderBy: { dataAbertura: 'desc' }
    });
    res.json(ordens);
  } catch (error) {
    console.error('Erro ao listar ordens:', error);
    res.status(500).json({ error: 'Erro ao listar ordens de serviço' });
  }
}

async function buscarPorId(req, res) {
  try {
    const { id } = req.params;
    const ordem = await req.prisma.ordemServico.findFirst({
      where: { id },
      include: {
        cliente: true,
        veiculo: true,
        itens: {
          include: {
            peca: true
          }
        }
      }
    });

    if (!ordem) {
      return res.status(404).json({ error: 'Ordem de serviço não encontrada' });
    }

    res.json(ordem);
  } catch (error) {
    console.error('Erro ao buscar ordem:', error);
    res.status(500).json({ error: 'Erro ao buscar ordem de serviço' });
  }
}

async function listarPorVeiculo(req, res) {
  try {
    const { veiculoId } = req.params;
    const ordens = await req.prisma.ordemServico.findMany({
      where: { veiculoId },
      include: {
        itens: {
          include: {
            peca: { select: { nome: true } }
          }
        }
      },
      orderBy: { dataAbertura: 'desc' }
    });
    res.json(ordens);
  } catch (error) {
    console.error('Erro ao listar ordens do veículo:', error);
    res.status(500).json({ error: 'Erro ao listar ordens' });
  }
}

async function criar(req, res) {
  try {
    const { clienteId, veiculoId, descricaoServico, status } = req.body;

    if (!clienteId || !veiculoId || !descricaoServico) {
      return res.status(400).json({ error: 'Campos obrigatórios faltando' });
    }

    const ordem = await req.prisma.ordemServico.create({
      data: {
        clienteId,
        veiculoId,
        descricaoServico,
        status: status || 'aberta'
      },
      include: {
        cliente: { select: { nome: true } },
        veiculo: { select: { placa: true, modelo: true } }
      }
    });

    res.status(201).json(ordem);
  } catch (error) {
    console.error('Erro ao criar ordem:', error);
    res.status(500).json({ error: 'Erro ao criar ordem de serviço' });
  }
}

async function atualizar(req, res) {
  try {
    const { id } = req.params;
    const { clienteId, veiculoId, descricaoServico, status } = req.body;

    const data = {
      clienteId,
      veiculoId,
      descricaoServico,
      status
    };

    if (status === 'finalizada') {
      data.dataFechamento = new Date();
    }

    const ordem = await req.prisma.ordemServico.update({
      where: { id },
      data,
      include: {
        cliente: { select: { nome: true } },
        veiculo: { select: { placa: true, modelo: true } }
      }
    });

    res.json(ordem);
  } catch (error) {
    console.error('Erro ao atualizar ordem:', error);
    res.status(500).json({ error: 'Erro ao atualizar ordem de serviço' });
  }
}

async function adicionarPeca(req, res) {
  try {
    const { id } = req.params;
    const { pecaId, quantidade } = req.body;

    if (!pecaId || !quantidade) {
      return res.status(400).json({ error: 'Peça e quantidade são obrigatórios' });
    }

    const peca = await req.prisma.peca.findFirst({
      where: { id: pecaId }
    });

    if (!peca) {
      return res.status(404).json({ error: 'Peça não encontrada' });
    }

    const item = await req.prisma.itemOrdemServico.create({
      data: {
        osId: id,
        pecaId,
        quantidade: parseInt(quantidade)
      }
    });

    const novoEstoque = peca.quantidadeEstoque - parseInt(quantidade);
    await req.prisma.peca.update({
      where: { id: pecaId },
      data: { quantidadeEstoque: novoEstoque }
    });

    if (novoEstoque < 0) {
      console.warn(`⚠️ ALERTA: Estoque negativo para peça ${peca.nome}`);
    }

    res.status(201).json(item);
  } catch (error) {
    console.error('Erro ao adicionar peça:', error);
    res.status(500).json({ error: 'Erro ao adicionar peça' });
  }
}

module.exports = {
  listar,
  buscarPorId,
  listarPorVeiculo,
  criar,
  atualizar,
  adicionarPeca
};