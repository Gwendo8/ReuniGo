FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN mkdir -p /app/uploads

EXPOSE 8000

CMD ["node", "index.js"]