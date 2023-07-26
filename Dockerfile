# Build base
# FROM 262972253311.dkr.ecr.ap-northeast-1.amazonaws.com/dev-ck-cloudkyotsukiban-base:bv078_node_18.15-alpine3.16 AS base
# WORKDIR /app
# COPY package.json yarn.lock ./
# RUN apk add --no-cache \
#   && yarn install --frozen-lockfile \
#   && yarn cache clean

# Build image
# FROM 262972253311.dkr.ecr.ap-northeast-1.amazonaws.com/dev-ck-cloudkyotsukiban-base:bv078_node_18.15-alpine3.16 AS build
# WORKDIR /app
# COPY . .
# COPY --from=base /app/node_modules ./node_modules
# RUN apk add --no-cache \
#   && yarn install --production --frozen-lockfile --ignore-scripts --prefer-offline \
#   && yarn build 

# Build production
FROM 262972253311.dkr.ecr.ap-northeast-1.amazonaws.com/dev-ck-cloudkyotsukiban-base:bv078_node_18.15-alpine3.16 AS production

WORKDIR /app

ENV NODE_ENV production

ENV NEXT_SHARP_PATH /app/node_modules/sharp

COPY build/package*.json ./

COPY build/next.config.js ./

COPY build/public ./public

COPY build/.next/static ./.next/static

COPY build/.next/standalone ./

# RUN apk add curl
# USER node

EXPOSE 3000

CMD ["node", "server.js"]
