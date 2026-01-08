async function meusVeiculos(req, res) {
  try {
    if (req.user.role !== 'cliente') {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const veiculos = await req.prisma.veiculo.findMany({
      where: {
        clienteId: req.user.id
      },
      orderBy: { modelo: 'asc' }
    });

    res.json(veiculos);
  } catch (error) {
    console.error('Erro ao buscar veículos:', error);
    res.status(500).json({ error: 'Erro ao buscar veículos' });
  }
}

async function ordensDoVeiculo(req, res) {
  try {
    if (req.user.role !== 'cliente') {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const { veiculoId } = req.params;

    const veiculo = await req.prisma.veiculo.findFirst({
      where: {
        id: veiculoId,
        clienteId: req.user.id
      }
    });

    if (!veiculo) {
      return res.status(404).json({ error: 'Veículo não encontrado' });
    }

    const ordens = await req.prisma.ordemServico.findMany({
      where: {
        veiculoId
      },
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
    console.error('Erro ao buscar ordens:', error);
    res.status(500).json({ error: 'Erro ao buscar ordens de serviço' });
  }
}

module.exports = { meusVeiculos, ordensDoVeiculo };