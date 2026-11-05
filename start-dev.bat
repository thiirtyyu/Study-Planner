@echo off
title UniSync AI - Development Server
echo ===================================================
echo     Starting UniSync AI Development Server...
echo ===================================================
echo.
echo Opening browser at http://localhost:3000 ...
start http://localhost:3000
echo.
cmd /c "npm.cmd run dev"
pause
