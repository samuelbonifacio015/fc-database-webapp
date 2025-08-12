@echo off
echo ========================================
echo    ANDORRA FC MANAGER - TAILWIND CSS
echo ========================================
echo.
echo Iniciando proyecto...
echo.

REM Compilar Tailwind CSS
echo [1/3] Compilando Tailwind CSS...
call npm run build:css:prod
if %errorlevel% neq 0 (
    echo ERROR: No se pudo compilar Tailwind CSS
    pause
    exit /b 1
)

REM Abrir el archivo de prueba
echo [2/3] Abriendo archivo de prueba...
start test-tailwind.html

REM Abrir el proyecto principal
echo [3/3] Abriendo proyecto principal...
start src/html/index.html

echo.
echo ========================================
echo    PROYECTO INICIADO CORRECTAMENTE
echo ========================================
echo.
echo Archivos abiertos:
echo - test-tailwind.html (prueba de Tailwind)
echo - index.html (proyecto principal)
echo.
echo Para desarrollo con watch:
echo   npm run build:css
echo.
pause
