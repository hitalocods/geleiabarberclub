# Geleia Barber Club - Sistema Web de Agendamento & Gestão CRUD

Aplicação web full-stack desenvolvida em **Next.js 14 (App Router)** com **TypeScript**, **Tailwind CSS**, **Prisma ORM (Neon PostgreSQL)** e **Vercel Blob Storage**.

---

## 🎨 Identidade Visual & Cores da Logo

O design foi estruturado em torno da logo oficial da **Geleia Barber Club**:
- **Grafite / Carbono Escuro:** `#0A0C0E` e `#12151B`
- **Vermelho Carmesim (Destaque):** `#DC2626` / `#EF233C`
- **Textos & Detalhes:** Branco puro, prata `#E2E8F0` e efeitos Neon Glow

---

## 🚀 Como Executar Localmente

```bash
# 1. Instalar as dependências
npm install

# 2. Iniciar o servidor de desenvolvimento
npm run dev
```

Acesse em seu navegador: [http://localhost:3000](http://localhost:3000)

---

## 🛠️ CRUD Completo & Funcionalidades

1. **Agendamento Rápido Cliente (`/agendar`):**
   - Escolha do Serviço (Preço, Duração, Categoria, Foto)
   - Escolha do Barbeiro
   - Escolha da Data e Horário sem conflito
   - Confirmação com comprovante em tela e envio direto para WhatsApp

2. **Consulta e Cancelamento (`/meus-agendamentos`):**
   - Busca por número de telefone
   - Visualização de horários ativos e botão de cancelamento

3. **Painel de Administração (`/admin`):**
   - **Visão Geral:** Métricas de faturamento, total de agendamentos do dia, barbeiro mais solicitado.
   - **CRUD de Serviços (`/admin/servicos`):** Criar, editar preço/duração, trocar foto (upload Vercel Blob) e ativar/desativar.
   - **CRUD de Barbeiros (`/admin/barbeiros`):** Criar, editar especialidades, horários de atendimento e foto de perfil.
   - **Gestão de Agendamentos (`/admin/agendamentos`):** Filtros por status, agendamento manual presencial, confirmação e finalização.

---

## ☁️ Como Fazer Deploy na Vercel com Neon & Blob

### 1. Banco de Dados Neon (PostgreSQL)
1. Crie uma conta no [Neon.tech](https://neon.tech) e crie um novo projeto.
2. Copie a string de conexão em **Database Details** (ex: `postgresql://user:pass@ep-cool-123.us-east-2.aws.neon.tech/neondb?sslmode=require`).
3. Adicione a variável `DATABASE_URL` no painel de configurações de ambiente da Vercel (**Environment Variables**).
4. No terminal, rode `npx prisma db push` para criar as tabelas automaticamente no Neon DB.

### 2. Upload de Imagens Vercel Blob
1. No projeto da Vercel, acesse a aba **Storage** e crie um **Blob Store**.
2. Copie o token `BLOB_READ_WRITE_TOKEN` gerado e cole nas **Environment Variables** do projeto Vercel.

### 3. Deploy
1. Conecte o repositório GitHub no painel da Vercel e clique em **Deploy**.
