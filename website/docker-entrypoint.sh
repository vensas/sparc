#!/bin/sh
# Renders the site configuration from the environment, then runs nginx in the foreground.
#   SITE_HOST   host names that the site answers to (separated by spaces)
set -eu

: "${SITE_HOST:=localhost}"

# The value goes into the nginx configuration, so only plain host names are allowed.
echo "$SITE_HOST" | grep -Eq '^[A-Za-z0-9.-]+( [A-Za-z0-9.-]+)*$' || { echo "invalid SITE_HOST" >&2; exit 1; }

export SITE_HOST
envsubst '${SITE_HOST}' < /etc/nginx/templates/site.conf.template > /etc/nginx/site/site.conf
exec nginx -g 'daemon off;'
