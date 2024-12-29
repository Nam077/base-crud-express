FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY pnpm-lock.yaml ./

RUN npm install -g pnpm
RUN pnpm install

COPY . .

# Set environment variables
ENV NODE_ENV=production
ENV DOCKER_ENV=true

RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "start"]
