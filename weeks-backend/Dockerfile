FROM node:16
WORKDIR /app
COPY . .
RUN rm -rf node_modules
RUN npm install
RUN npm run build
RUN cd build && npm ci --production

CMD ["node", "build/server.js"]