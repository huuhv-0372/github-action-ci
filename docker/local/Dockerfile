# Build production
FROM node:18.15.0-alpine3.16  AS production

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
