FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY src/ ./src/

# COLOR se inyecta en build: blue o green
ARG COLOR=blue
ENV VERSION=$COLOR
ENV PORT=3000

EXPOSE 3000

CMD ["node", "src/index.js"]
