FROM oven/bun

WORKDIR /app
COPY package.json package.json
RUN bun install

COPY . .
RUN bun run build

EXPOSE 3000
ENTRYPOINT ["ORIGIN=https://washed-up.frederikbarbre.dk", "bun", "./build"]