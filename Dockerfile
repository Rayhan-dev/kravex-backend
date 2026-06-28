FROM node:22-slim

# Medusa needs these for some native deps + healthchecks
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl python3 build-essential \
    && rm -rf /var/lib/apt/lists/*

RUN corepack enable

WORKDIR /app

# Copy manifest + yarn config first for better layer caching
COPY package.json yarn.lock .yarnrc.yml ./
# If you have a .yarn/releases folder (Yarn 4 Berry), copy it too:

RUN yarn install

COPY . .

RUN yarn build

EXPOSE 9000

CMD ["sh", "-c", "yarn medusa db:migrate && yarn start"]