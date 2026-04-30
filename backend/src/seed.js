const prisma = require('./config/prisma');

async function main() {
  // 1. Procura o usuário que criamos no teste
  const usuario = await prisma.usuario.findUnique({
    where: { email: 'joao@email.com' }
  });

  if (!usuario) {
    console.log('❌ Usuário não encontrado. Faça o cadastro primeiro.');
    return;
  }

  // 2. Cria as categorias vinculadas a esse usuário
  const categorias = await prisma.categoria.createMany({
    data: [
      { usuario_id: usuario.id, nome: 'Alimentação', planoContas: 'Despesas Variáveis' },
      { usuario_id: usuario.id, nome: 'Moradia', planoContas: 'Despesas Fixas' },
      { usuario_id: usuario.id, nome: 'Salário', planoContas: 'Receitas Fixas' },
      { usuario_id: usuario.id, nome: 'Serviços F5', planoContas: 'Receitas Variáveis' }
    ],
    skipDuplicates: true // Evita criar duplicado se rodar o script duas vezes
  });

  console.log(`✅ Foram criadas categorias padrão para o usuário: ${usuario.nome}`);
}

main()
  .catch((erro) => {
    console.error(erro);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });