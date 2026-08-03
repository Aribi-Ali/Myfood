@echo off
echo Starting YallahKool application...
echo.
echo Your local IPs:
for /f "tokens=2 delims=: " %%a in ('netsh interface ip show address ^| find "IP Address"') do echo   http://%%a:3000
echo.
echo Access the app from other devices at http://YOUR_IP:3000
echo.

:: Start Laravel server (0.0.0.0 = accessible on local network)
start "Laravel Server" cmd /k "php artisan serve --host=0.0.0.0 --port=8000"

:: Start queue worker
start "Queue Worker" cmd /k "php artisan queue:work"

:: Start Next.js dev server (0.0.0.0 = accessible on local network)
start "Next.js Dev" cmd /k "cd front-end && npm run dev -- -H 0.0.0.0"

:: Start Reverb WebSocket server
start "Reverb Server" cmd /k "cd reverb-server && php artisan reverb:start"

echo All services started!
pause
