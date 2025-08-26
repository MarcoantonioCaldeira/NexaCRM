# Usa uma imagem Node.js oficial
FROM node:20-alpine

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia os arquivos package.json e package-lock.json (se existir)
COPY package*.json ./

# Instala as dependências de produção
RUN npm install

# Copia o restante do código da sua aplicação
COPY . .

# Expõe a porta que a aplicação usa
EXPOSE 3000

# Comando para iniciar a aplicação em modo de desenvolvimento
CMD ["npm", "run", "start:dev"]