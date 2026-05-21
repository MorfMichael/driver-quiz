FROM oven/bun:1 AS build
WORKDIR /app

COPY . .
RUN bun ci
RUN bun run build
# Serve Application using Nginx Server
FROM nginx:alpine
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY --from=build /dist/driver-quiz/browser /usr/share/nginx/html

CMD ["/bin/sh" , "-c" , "/usr/share/nginx/html/index.html && exec nginx -g 'daemon off;'"]

EXPOSE 80