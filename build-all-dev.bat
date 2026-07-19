@echo off
title Despliegue de frontend-fyxtoken

echo ============================================================
echo 1. Iniciando compilacion de desarrollo (React)...
echo ============================================================
:: Usamos 'call' para que el .bat continue despues de ejecutar npm
call npm run build:prod

:: Validamos si la compilacion tuvo exito
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Hubo un problema compilando el proyecto React. Proceso abortado.
    goto fin
)

echo.
echo ============================================================
echo 2. Cambiando de directorio a build-prod...
echo ============================================================
:: En Windows usamos barra invertida (\) para las rutas locales
cd ..\build-prod

echo.
echo ============================================================
echo 3. Construyendo la imagen Docker...
echo ============================================================
docker build -f Dockerfile_prod -t anloder4/robot-frontend-prov:latest .

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Fallo la construccion de la imagen Docker.
    goto fin
)

echo.
echo ============================================================
echo ¡Todo el proceso se ha completado con exito!
echo ============================================================

:fin
:: Evita que la ventana de la consola se cierre de inmediato para que puedas ver el resultado
pause