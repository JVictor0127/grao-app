🌱 Grão - Controle Financeiro Inteligente
O Grão é um ecossistema de gestão financeira desenvolvido para oferecer controle total sobre fluxos de caixa, unindo uma interface moderna a uma arquitetura robusta. Este projeto nasceu como o MVP (Minimum Viable Product) de uma solução voltada para as metodologias de assessoria e consultoria financeira da Gestão F5.

🚀 Tecnologias Utilizadas
Frontend
React (Vite): Framework para uma interface reativa e rápida.

Tailwind CSS v4: Estilização utilitária de última geração para design responsivo e Dark Mode.

Lucide React: Conjunto de ícones minimalistas e modernos.

Axios: Cliente HTTP para comunicação com a API.

React Router Dom: Gerenciamento de rotas e navegação.

Backend
Node.js & Express: Ambiente de execução e framework para a API Restful.

Prisma ORM: Ferramenta de mapeamento objeto-relacional para manipulação do banco de dados.

PostgreSQL: Banco de dados relacional para armazenamento seguro de dados.

JWT (JSON Web Token): Protocolo de segurança para autenticação e proteção de rotas.

🛠️ Funcionalidades Atuais
Autenticação Completa: Sistema de login e cadastro de usuários com criptografia e tokens de acesso.

Dashboard Financeiro: Visão geral de Receitas, Despesas e Saldo Atual, calculados em tempo real.

Gestão de Lançamentos:

Criação de novos registros (Receita/Despesa) via Modal intuitivo.

Listagem dinâmica com exclusão de registros e atualização automática de saldo.

Filtros avançados por tipo (Receita/Despesa) e busca textual por descrição.

Gestão de Categorias: Sistema de personalização de categorias para organização financeira baseada em modelos de gestão.

📂 Estrutura do Projeto
Plaintext
grao-app/
├── backend/          # API Node.js, Prisma Schema e Rotas
└── frontend/         # SPA React, Tailwind v4 e Services
🔧 Configuração e Instalação
Pré-requisitos
Node.js instalado.

Instância de PostgreSQL ativa.

Backend
Acesse a pasta: cd backend

Instale as dependências: npm install

Configure o arquivo .env com a sua DATABASE_URL.

Execute as migrations: npx prisma migrate dev

Inicie o servidor: npm run dev (Padrão: http://localhost:3333)

Frontend
Acesse a pasta: cd frontend

Instale as dependências: npm install

Inicie a aplicação: npm run dev (Padrão: http://localhost:5173)

👤 Autor
João Victor Costa

Analista de Suporte na Maxdata.

Diretor Comercial e de Projetos na EJCON (UEMASUL).

Graduando em Administração de Empresas com foco em Business Intelligence e Desenvolvimento Full-Stack.

Status do Projeto: Em desenvolvimento (MVP Concluído).