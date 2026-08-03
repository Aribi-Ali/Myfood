Write-Output "Running deployment steps..."

php -v
composer install --no-interaction --optimize-autoloader --no-dev
npm install; npm run build

# Only generate key on FIRST deploy. Remove this block after initial setup.
if (-not (Test-Path "storage/.key_generated")) {
    php artisan key:generate -n
    New-Item -ItemType File -Path "storage/.key_generated" -Force | Out-Null
}

php artisan migrate --force
php artisan storage:link; if ($LASTEXITCODE -ne 0) { Write-Output 'storage:link failed or already exists' }
php artisan config:cache
php artisan route:cache
php artisan view:cache

Write-Output "Deployment steps complete."
