# --- Estágio 1: Build ---
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# --- ADICIONE ESTAS DUAS LINHAS ANTES DO BUILD ---
# 1. Recebe o argumento do docker-compose
# ARG VITE_API_URL
# 2. Transforma em variável de ambiente para o Vite ler durante o build
# ENV VITE_API_URL=$VITE_API_URL
ENV VITE_API_URL=https://fitnessapi.andreailtondev.tech
# -------------------------------------------------

RUN npm run build

# --- Estágio 2: Nginx ---
FROM nginx:alpine

# Remove config padrão
RUN rm /etc/nginx/conf.d/default.conf

# Copia config personalizada
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia build do React
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
