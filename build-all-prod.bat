@echo off
title Despliegue de frontend-fyxtoken

echo ============================================================
echo 1. Iniciando compilacion de produccion (React)...
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
docker build -f Dockerfile_prod -t anloder4/robot-frontend:latest .

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Fallo la construccion de la imagen Docker.
    goto fin
)



echo.
echo ============================================================
echo 4. Subiendo la imagen a Docker Hub (Push)...
echo ============================================================
docker push anloder4/robot-frontend:latest

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Fallo el docker push. Asegurate de haber iniciado sesion en tu terminal con 'docker login'.
    goto fin
)

echo.
echo ============================================================
echo 5. Limpieza opcional de imagen local
echo ============================================================
:pregunta
set /p RESPUESTA="¿Desea eliminar la imagen local creada (anloder4/robot-frontend:latest)? (S/N): "

if /i "%RESPUESTA%"=="S" goto eliminar
if /i "%RESPUESTA%"=="N" goto exito
echo Opcion no valida. Por favor introduce S (Si) o N (No).
goto pregunta

:eliminar
echo.
echo Eliminando imagen local de tu equipo...
docker rmi anloder4/robot-frontend:latest
if %errorlevel% neq 0 (
    echo [WARN] No se pudo eliminar la imagen local. Puede estar siendo usada por algun contenedor activo o pausado.
) else (
    echo Imagen local eliminada correctamente de este equipo.
)
goto exito

:exito
echo.

echo ============================================================
echo ¡Todo el proceso se ha completado con exito!
echo ============================================================

:fin
:: Evita que la ventana de la consola se cierre de inmediato para que puedas ver el resultado
pause