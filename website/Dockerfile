# Build context: the repository root, because the build reads the record of sparc (website/test.sh, AppHost).
FROM node:lts-alpine AS build
WORKDIR /src
COPY . .
RUN node scripts/build-website.mjs /site

# Alpine's own nginx with the headers-more module, so the configuration can remove the Server header.
FROM alpine:3.24
RUN apk upgrade --no-cache \
 && apk add --no-cache nginx nginx-mod-http-headers-more gettext-envsubst \
 && mkdir -p /etc/nginx/templates /etc/nginx/site \
 && chown nginx:nginx /etc/nginx/site
COPY website/nginx/nginx.conf website/nginx/security-headers.conf /etc/nginx/
COPY website/nginx/site.conf.template /etc/nginx/templates/
COPY website/docker-entrypoint.sh /usr/local/bin/
COPY --from=build /site /usr/share/sparc
# Unprivileged: nginx runs as its own user on a high port. kamal-proxy terminates TLS in front.
USER nginx
EXPOSE 8080
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
