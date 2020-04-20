FROM arm32v7/node:13-slim
# FROM node:13

WORKDIR /usr/src/app

COPY ./package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
