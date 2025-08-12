FROM node:22-alpine AS base  

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./

# install dependencies (production only for smaller image)
RUN pnpm install --frozen-lockfile

# copy the rest of your source code
COPY . .

FROM base AS build

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

RUN pnpm run build

FROM node:22-alpine AS production

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./

RUN pnpm install --prod --frozen-lockfile

COPY --from=build /app/build ./build
COPY --from=build /app/package.json ./

# expose the port your app runs on
EXPOSE 3000

ENV ORIGIN=http://127.0.0.1:3000

# start the application
CMD ["node", "build"]