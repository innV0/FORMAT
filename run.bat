@echo off
echo ===================================================
echo   Iniciando Servidor de Desarrollo para FORMAT
echo ===================================================
echo.

echo [1/3] Verificando e instalando dependencias de la app...
call npm install
echo.

echo [2/3] Construyendo la web comercial...
cd website
call npm install --silent
call node build.mjs
cd ..
echo.

echo [3/3] Abriendo la web y lanzando el servidor de desarrollo...
start http://localhost:5173
start docs\index.html
call npm run dev
pause
