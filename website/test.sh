#!/bin/sh
# Checks the website container: pages, host filter, health, 404 pages, security headers,
# no cookies, and an access log without IP addresses.
# Usage: website/test.sh   (needs docker, or podman with CONTAINER=podman)
set -eu

CONTAINER="${CONTAINER:-docker}"
PORT="${PORT:-8098}"
BASE="http://localhost:$PORT"
NAME="sparc-website-test"
cd "$(dirname "$0")/.."

"$CONTAINER" build -q -t "$NAME" -f website/Dockerfile . >/dev/null
cleanup() { "$CONTAINER" rm -f "$NAME" >/dev/null 2>&1 || true; }
cleanup
trap cleanup EXIT
"$CONTAINER" run -d --name "$NAME" -p "$PORT:8080" -e SITE_HOST=localhost "$NAME" >/dev/null

for _ in 1 2 3 4 5 6 7 8 9 10; do
  curl -sf "$BASE/health" >/dev/null && break
  sleep 1
done

failures=0
check() {
  if [ "$2" = "$3" ]; then
    echo "ok    $1"
  else
    echo "FAIL  $1: expected '$2', got '$3'"
    failures=$((failures + 1))
  fi
}
status() { curl -s -o /dev/null -w '%{http_code}' "$@"; }
headers() { curl -s -D - -o /dev/null "$@" | tr -d '\r'; }
header() { headers "$2" | sed -n "s/^$1: //Ip"; }

for page in / /imprint.html /privacy.html /de/ /de/imprint.html /de/privacy.html /assets/site.css /assets/site.js /assets/icon.svg /assets/fonts/archivo.woff2; do
  check "page $page" "200" "$(status "$BASE$page")"
done
check "/de gets its trailing slash" "301 $BASE/de/" "$(curl -s -o /dev/null -w '%{http_code} %{redirect_url}' "$BASE/de")"

# Web server: Other host
check "other host names get no response" "52" "$(curl -s -o /dev/null -H 'Host: other.example' "$BASE/" && echo 0 || echo $?)"
# Web server: Health check
check "health answers for any host" "200" "$(status -H 'Host: 203.0.113.5:8080' "$BASE/health")"
# Web server: Page not found
check "a missing German page is 404" "404" "$(status "$BASE/de/missing.html")"
check "the German 404 page is German" "yes" "$(curl -s "$BASE/de/missing.html" | grep -q '<html lang="de">' && echo yes || echo no)"
check "the English 404 page is English" "yes" "$(curl -s "$BASE/missing.html" | grep -q '<html lang="en">' && echo yes || echo no)"
check "404 pages do not name the server" "0" "$(curl -s "$BASE/missing.html" | grep -ci nginx || true)"
check "only GET and HEAD" "405" "$(status -X POST "$BASE/")"
check "405 names the allowed methods" "GET, HEAD" "$(curl -s -D - -o /dev/null -X POST "$BASE/" | tr -d '\r' | sed -n 's/^allow: //Ip')"
check "405 is plain text" "text/plain" "$(curl -s -D - -o /dev/null -X POST "$BASE/" | tr -d '\r' | sed -n 's/^content-type: \([^;]*\).*/\1/Ip')"
check "nginx cannot change its configuration" "" "$("$CONTAINER" exec "$NAME" find /etc/nginx -writable)"
# Web server: Security headers
check "no Server header" "" "$(header server "$BASE/")"
check "no Server header on errors" "" "$(header server "$BASE/missing.html")"
check "CSP without unsafe-inline" "yes" "$(header content-security-policy "$BASE/" | grep -q "default-src 'none'" && ! header content-security-policy "$BASE/" | grep -q unsafe-inline && echo yes || echo no)"
check "CSP on 404 pages" "yes" "$(header content-security-policy "$BASE/missing.html" | grep -q "default-src 'none'" && echo yes || echo no)"
check "HSTS" "max-age=31536000" "$(header strict-transport-security "$BASE/")"
check "nosniff" "nosniff" "$(header x-content-type-options "$BASE/")"
check "referrer policy" "strict-origin-when-cross-origin" "$(header referrer-policy "$BASE/")"
check "headers on assets too" "nosniff" "$(header x-content-type-options "$BASE/assets/site.css")"
# No cookies and no third-party requests: No cookie from the server
check "no cookie" "" "$(headers "$BASE/" "$BASE/de/" "$BASE/missing.html" | grep -i '^set-cookie:' || true)"
# Access log without IP address
log="$("$CONTAINER" logs "$NAME" 2>/dev/null | grep 'GET /imprint.html' | tail -n 1)"
check "the log has a line for the request" "yes" "$([ -n "$log" ] && echo yes || echo no)"
check "the log line has no IP address" "0" "$(printf '%s' "$log" | grep -cE '([0-9]{1,3}\.){3}[0-9]{1,3}' || true)"

[ "$failures" -eq 0 ] || { echo "$failures check(s) failed"; exit 1; }
echo "all checks passed"
