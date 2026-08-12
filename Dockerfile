# # syntax=docker/dockerfile:1

# # ---- Build stage ----------------------------------------------------------
# # Compiles the Medusa app; needs the native build toolchain and dev deps.
# FROM node:22-slim AS builder

# RUN apt-get update && apt-get install -y --no-install-recommends \
#     curl python3 build-essential && rm -rf /var/lib/apt/lists/*
# RUN corepack enable

# WORKDIR /app

# # Install deps first so this layer stays cached until the manifests change.
# COPY package.json yarn.lock .yarnrc.yml ./
# RUN yarn install

# # Build the standalone server into .medusa/server.
# COPY . .
# RUN yarn build

# # Install the built server's dependencies. react/react-dom (used to render the
# # order emails at runtime) live in devDependencies, so this must NOT be
# # --production, otherwise email rendering breaks.
# #
# # `medusa build` copies yarn.lock into the server output but NOT .yarnrc.yml.
# # Without it Yarn 4 defaults to the PnP linker and ignores node_modules at
# # runtime, so copy the config in to make the server a self-contained project.
# WORKDIR /app/.medusa/server
# RUN cp /app/.yarnrc.yml ./.yarnrc.yml && yarn install

# # ---- Runtime stage --------------------------------------------------------
# # Ships only the self-contained built server — no source tree, no compiler
# # toolchain, no dev/build-only node_modules from /app.
# FROM node:22-slim AS runner

# # curl kept for container healthchecks; build-essential/python3 are build-only.
# RUN apt-get update && apt-get install -y --no-install-recommends \
#     curl && rm -rf /var/lib/apt/lists/*

# # Pre-provision the exact Yarn version so container start needs no network fetch.
# RUN corepack enable && corepack prepare yarn@4.7.0 --activate

# WORKDIR /app/.medusa/server

# # The built server is a standalone deployable, including its own node_modules.
# COPY --from=builder /app/.medusa/server ./

# EXPOSE 9000
# CMD ["sh", "-c", "yarn medusa db:migrate && yarn start"]
# ------------------------------------------------------- old



# ------------------------------------------------------- new!!!

# ---- build stage ----
FROM node:22-slim AS builder

RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 build-essential && rm -rf /var/lib/apt/lists/*

RUN corepack enable
WORKDIR /app

COPY package.json yarn.lock .yarnrc.yml ./
RUN yarn install

COPY . .
RUN yarn build

# Medusa v2 builds a standalone server into .medusa/server
WORKDIR /app/.medusa/server
RUN yarn install

# ---- runtime stage ----
FROM node:22-slim AS runner

ENV NODE_ENV=production
RUN corepack enable

# non-root user
RUN useradd -m medusa

WORKDIR /app
COPY --from=builder /app/.medusa/server ./
RUN chown -R medusa:medusa /app

USER medusa

EXPOSE 9000
CMD ["sh", "-c", "yarn medusa db:migrate && yarn start"]
