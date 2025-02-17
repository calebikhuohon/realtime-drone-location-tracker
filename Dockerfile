FROM node:alpine
WORKDIR /app/backend
COPY backend/package.json .
RUN npm install
COPY ./backend .
CMD ["npm", "start"]

FROM node:alpine as builder
WORKDIR /app/frontend
COPY frontend/package.json ./
RUN npm install
COPY ./frontend .
RUN npm run build

FROM nginx
EXPOSE 3000
COPY ./frontend/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/frontend/build /usr/share/nginx/html