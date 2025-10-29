#!/usr/bin/env bash
set -e

# Koyeb inject $PORT -> đổi cổng Apache lúc runtime
if [ -n "${PORT}" ]; then
  sed -ri "s/^Listen .*/Listen ${PORT}/" /etc/apache2/ports.conf
fi

# Xóa cache cũ (an toàn khi biến môi trường thay đổi)
php artisan config:clear || true
php artisan route:clear  || true

exec "$@"
