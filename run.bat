@echo off
echo ===================================================
echo   Iniciando Servidor de Desarrollo para FORMAT
echo ===================================================
echo.
echo [1/2] Verificando e instalando dependencias (npm install)...
call npm install
echo.
echo [2/2] Lanzando el servidor de desarrollo y abriendo el navegador...
start http://localhost:5173
call npm run dev
pause
