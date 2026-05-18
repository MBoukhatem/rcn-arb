# Frontend — SPA React + Vite (mode developpement)
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

# --host expose Vite sur 0.0.0.0 pour etre accessible hors du conteneur
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
