# Build and validate the backend with development tooling, then install only production deps.
FROM node:24-alpine AS base

RUN npm i -g pnpm

FROM base AS dependencies

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install

FROM base AS build

WORKDIR /usr/src/app

COPY . .
COPY --from=dependencies /usr/src/app/node_modules ./node_modules

RUN pnpm build
RUN pnpm prune --prod

FROM node:24-alpine AS deploy

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/package.json ./package.json

EXPOSE 3333

CMD ["node", "dist/infra/http/server.js"]