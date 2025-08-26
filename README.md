
# 🚀 Nexa CRM

Aplicação fullstack construída com **React Native (Expo)** no frontend e **NestJS** no backend, utilizando **PostgreSQL** como banco de dados.  
Todo o ambiente é gerenciado com **Docker Compose**.

<img src="https://github.com/user-attachments/assets/c6da51b5-d442-4b2e-bd0e-c6f1c4c9802a" alt="Image" width="300"/>

---

## 🛠️ Tecnologias

- **Frontend:** React Native, Expo, Axios, Styled Components, TypeScript  
- **Backend:** NestJS (Node.js + TypeScript)  
- **Banco de dados:** PostgreSQL  
- **Administração de banco:** pgAdmin  
- **Infraestrutura:** Docker e Docker Compose  
- **ORM:** Prisma  

---

## 📦 Pré-requisitos

- [Docker](https://docs.docker.com/get-docker/)  
- [Docker Compose](https://docs.docker.com/compose/)  

---

## 🔧 Configuração de ambiente

Crie um arquivo `.env` na raiz do backend (`nexa_backend`) com a variável:

```env
DATABASE_URL=postgresql://user:password@db:5432/nexa_crm
```

> Substitua `user`, `password` e `nexa_crm` conforme suas necessidades.

---

## 📦 Rodando o projeto

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/nexa-crm.git
cd nexa-crm
```

2. Suba os containers com Docker Compose:

```bash
docker-compose up --build
```

3. O Docker irá iniciar os seguintes serviços:

| Serviço       | Porta no Host       | Descrição                          |
|---------------|-------------------|------------------------------------|
| **Frontend (Expo Web)** | 8081               | Interface web do CRM |
| **Backend (NestJS API)** | 3000               | API REST do sistema |
| **Postgres** | 5432               | Banco de dados principal |
| **pgAdmin** | 8080               | Interface de administração do banco |

---

## 🗄️ Banco de Dados

- **Host:** `db`  
- **Porta:** `5432`  
- **Usuário:** `user`  
- **Senha:** `password`  
- **Banco:** `nexa_crm`  

### pgAdmin

- URL: [http://localhost:8080](http://localhost:8080)  
- Login: `admin@nexa.com`  
- Senha: `password`  

Para conectar ao banco dentro do pgAdmin:  
- **Host:** `db`  
- **Usuário:** `user`  
- **Senha:** `password`  

---

## 🔄 Migrações com Prisma (Backend)

Se precisar criar ou aplicar migrações no banco:

```bash
# Dentro do container backend
npx prisma migrate deploy

# Ou gerar uma nova migração
npx prisma migrate dev --name nome_migracao
```

---

## 📡 Endpoints da API

### Produtos
- **GET** `/products/list` → Lista todos os produtos

### Pedidos
- **GET** `/orders/list` → Lista todos os pedidos  
- **POST** `/orders/create` → Cria um novo pedido  
- **DELETE** `/orders/:id` → Remove um pedido pelo ID  
- **PATCH** `/orders/:id` → Atualiza um pedido pelo ID  

---

## 📱 Frontend (React Native + Expo)

O frontend consome a API utilizando **Axios**.  

Exemplo de uso:

```ts
const response = await axios.get("http://192.168.1.103:3000/products/list");
```

> ⚠️ Substitua o IP pelo do seu host se estiver acessando via celular.  
> Para rodar apenas no navegador (`expo web`), use `http://localhost:3000`.

- **Web:** [http://localhost:8081](http://localhost:8081)  
- **Expo QR Code (celular na mesma rede):** [http://localhost:19000](http://localhost:19000)  

---

## 🛠️ Comandos úteis

Subir containers:

```bash
docker-compose up --build
```

Rodar em segundo plano:

```bash
docker-compose up -d
```

Parar containers:

```bash
docker-compose down
```

Dentro do container backend:

```bash
# Aplicar migrações
npx prisma migrate deploy
```

---

## 📌 Observações

- O frontend roda na porta **8081**, para não conflitar com o pgAdmin (**8080**).  
- O QR Code do Expo funciona apenas se o celular e o PC estiverem na mesma rede.  
- Alterações no código são refletidas automaticamente graças aos volumes mapeados.  
- Certifique-se de que as portas do host não estejam ocupadas por outros serviços.
- Também é possivel rodar a aplicação de maneira tradicional baixando os pacotes e configurando manualmente cada serviço
---

