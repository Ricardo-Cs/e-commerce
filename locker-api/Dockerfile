# Build
FROM node:22-alpine AS builder

# Setando diretório principal (working directory)
WORKDIR /src

# Copiando package.json
COPY package*.json ./

# Instalando dependências
RUN npm i

# Copiando código fonte
COPY . .

RUN npm run build

# Iniciando a aplicação
CMD ["node", "dist/app.js"]