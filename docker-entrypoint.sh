#!/bin/sh

cat > /usr/share/nginx/html/runtime-config.js <<EOF
window.RUNTIME_CONFIG = {
  API_CONTEXT: "${API_CONTEXT:-local}"
};
EOF

exec nginx -g "daemon off;"