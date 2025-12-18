# ---------- STAGE 1: BUILD ----------
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build
# Vite gera a pasta /dist

# ---------- STAGE 2: NGINX ----------
FROM nginx:alpine

# Remove config padrão
RUN rm /etc/nginx/conf.d/default.conf

# Copia config personalizada
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia build do React
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
