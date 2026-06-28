FROM node:22-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl python3 build-essential && rm -rf /var/lib/apt/lists/*
RUN corepack enable

WORKDIR /app
COPY package.json yarn.lock .yarnrc.yml ./
RUN yarn install
COPY . .

RUN yarn build

# Medusa v2 builds a standalone server into .medusa/server
WORKDIR /app/.medusa/server

# install production deps inside the built output
RUN yarn install

EXPOSE 9000
CMD ["sh", "-c", "yarn medusa db:migrate && yarn start"]