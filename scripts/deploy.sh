#!/usr/bin/env bash
set -euo pipefail

echo "Running deployment steps..."

php -v
composer install --no-interaction --optimize-autoloader --no-dev
npm install && npm run build

# Only generate key on FIRST deploy. Remove this line after initial setup.
if [ ! -f storage/.key_generated ]; then
    php artisan key:generate --force
    touch storage/.key_generated
fi

php artisan migrate --force
php artisan storage:link || true
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "Deployment steps complete."
