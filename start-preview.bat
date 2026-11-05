@echo off
title UniSync AI - Production Preview
echo ===================================================
echo     Starting UniSync AI Production Preview...
echo ===================================================
echo.
echo Opening browser at http://localhost:4173 ...
start http://localhost:4173
echo.
cmd /c "npm.cmd run preview"
pause
