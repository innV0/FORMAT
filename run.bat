@echo off
echo ===================================================
echo   Iniciando Servidor de Desarrollo para _FORMAT
echo ===================================================
echo.

echo [1/2] Verificando e instalando dependencias de la app...
call npm install
echo.

echo [2/2] Abriendo la app, la documentación, la web pública y lanzando el servidor...
start http://localhost:5173/app/
start http://localhost:5173/documentation/
start http://localhost:5173/site/
call npm run dev
pause
