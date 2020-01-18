FROM node:alpine
WORKDIR /backend
COPY ./backend/package.json /app/backend
RUN npm install
COPY /backend /app/backend
CMD ["npm", "run, ""start"]

FROM node:alpine as builder
WORKDIR /frontend
COPY ./frontend/package.json /app/frontend
RUN npm install
COPY /frontend /app/backend
RUN npm run build

FROM nginx
EXPOSE 3000
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html