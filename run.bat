@echo off
echo ===================================================
echo   Iniciando Servidor de Desarrollo para FORMAT
echo ===================================================
echo.

echo [1/2] Verificando e instalando dependencias de la app...
call npm install
echo.

echo [2/2] Abriendo la app, la documentación y lanzando el servidor...
start http://localhost:5173
start http://localhost:5173/docs/
call npm run dev
pause
