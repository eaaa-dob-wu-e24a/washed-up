# FROM oven/bun

# WORKDIR /app
# COPY package.json package.json
# RUN bun install

# COPY . .
# RUN bun run build

# EXPOSE 3000
# ENTRYPOINT ["bun", "./build"]

FROM node:alpine

WORKDIR /app
COPY package.json ./
RUN npm install --force

COPY . .
RUN npm run build

ENV ORIGIN=https://washed-up.frederikbarbre.dk

CMD ["node", "build"]

EXPOSE 3000