FROM node:alpine

WORKDIR /app
COPY package.json ./
RUN npm install --force

COPY . .
RUN npm run build

ENV ORIGIN=https://washed-up.frederikbarbre.dk

CMD ["node", "build"]

EXPOSE 3000