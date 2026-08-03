# YallahKool Reverb Server

Standalone Laravel WebSocket server using [Laravel Reverb](https://reverb.laravel.com).

Handles all real-time features: order updates, kitchen display, delivery tracking, chef notifications.

## Architecture

This is a **minimal Laravel installation** that only runs the Reverb WebSocket server — no HTTP routes, no web UI, no database migrations. It connects to Redis for pub/sub and authenticates channels via the main Laravel app's broadcasting auth endpoint.

```
┌─────────────┐      ┌──────────────┐      ┌──────────────┐
│  Next.js     │◄────►│  Laravel App │◄────►│  Database    │
│  (frontend)  │ ws   │  (HTTP API)  │      │  (SQLite)    │
└──────┬───────┘      └──────┬───────┘      └──────────────┘
       │                     │
       │   WebSocket         │ POST /broadcasting/auth
       ▼                     ▼
┌─────────────────────────────────────┐
│  Reverb Server (this directory)     │
│  php artisan reverb:start           │
│  ws://0.0.0.0:8080                  │
└─────────────────────────────────────┘
```

## Quick Start

```bash
cd reverb-server

# 1. Install dependencies
composer install

# 2. Generate app key
php artisan key:generate

# 3. Start the WebSocket server
php artisan reverb:start
```

### Windows

```powershell
composer install
php artisan key:generate
php artisan reverb:start
```

## Configuration

All config is in `.env`. The key and secret **must match** the main Laravel app's `.env`.

| Variable | Default | Description |
|----------|---------|-------------|
| `REVERB_APP_ID` | `app-yallahkool` | Must match main app |
| `REVERB_APP_KEY` | `yallahkool-reverb-key` | Must match main app |
| `REVERB_APP_SECRET` | (your secret) | Must match main app |
| `REVERB_HOST` | `localhost` | Advertised host |
| `REVERB_PORT` | `8080` | WebSocket port |
| `REVERB_SERVER_HOST` | `0.0.0.0` | Bind address |
| `REVERB_SERVER_PORT` | `8080` | Bind port |
| `BROADCAST_CONNECTION` | `reverb` | Must be `reverb` |

## Channels

| Channel | Type | Listeners |
|---------|------|-----------|
| `orders.store.{storeId}` | Private | Owner dashboard, KDS |
| `orders.client.{clientId}` | Private | Client order tracking |
| `private-kds.{storeId}` | Private | Kitchen Display |
| `private-delivery.{userId}` | Private | Delivery rider |
| `presence-delivery.{wilaya}` | Presence | Rider availability |
| `private-chef.{chefUserId}` | Private | Chef notifications |
| `presence-store-owners` | Presence | Admin monitoring |

## Production

Run with a process manager:

### Supervisor
```ini
[program:yallahkool-reverb]
process_name=%(program_name)s
command=php /path/to/reverb-server/artisan reverb:start
user=www-data
autostart=true
autorestart=true
startretries=3
stderr_logfile=/var/log/reverb-err.log
stdout_logfile=/var/log/reverb-out.log
```

### Docker
```dockerfile
FROM php:8.2-cli
WORKDIR /app
COPY . .
RUN composer install --no-dev
EXPOSE 8080
CMD ["php", "artisan", "reverb:start"]
```
