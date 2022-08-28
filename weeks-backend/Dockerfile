FROM node:16
WORKDIR /app
COPY . .
COPY ./.adonisrc.json ./.adonisrc.json
RUN rm -rf node_modules
RUN npm install
RUN npm run build
RUN cd build && npm ci --production

CMD ["node", "build/server.js"]