# Backend — API Express + Mongoose
FROM node:22-alpine

WORKDIR /app

# Installation des dependances (couche cachee tant que package*.json ne change pas)
COPY package*.json ./
RUN npm install

# Code source
COPY . .

EXPOSE 5000

# npm run dev (nodemon) pour le hot-reload en developpement
CMD ["npm", "run", "dev"]
