FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --production

FROM node:20-alpine

ENV NODE_ENV=production
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY . .

EXPOSE 4000

CMD ["sh", "-c", "npx prisma db push && node src/index.js"]
