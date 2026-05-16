FROM node:18-alpine

RUN apk add --no-cache bash curl

WORKDIR /usr/src/app

COPY package.json package-lock.json* ./
RUN npm ci --only=production || npm install --production

COPY . .

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 5000
ENV NODE_ENV=production
CMD ["/usr/local/bin/docker-entrypoint.sh"]
