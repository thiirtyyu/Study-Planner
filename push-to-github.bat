@echo off
title Push UniSync AI to GitHub
chcp 65001 > nul
echo ===================================================
echo       UniSync AI - Push to GitHub Setup
echo ===================================================
echo.

:: Check if git is installed
where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [!] ตรวจไม่พบโปรแกรม Git ในเครื่องของคุณ
    echo.
    echo คุณสามารถเลือกวิธีใดวิธีหนึ่งต่อไปนี้:
    echo 1. ดาวน์โหลด Git จาก: https://git-scm.com/download/win
    echo 2. หรือใช้ GitHub Desktop (แนะนำ): https://desktop.github.com
    echo 3. หรือเปิด PowerShell แบบปกติ (Run as Administrator) แล้วพิมพ์:
    echo    winget install --id Git.Git -e --source winget
    echo.
    pause
    exit /b
)

echo [✓] ตรวจพบ Git ในเครื่องเรียบร้อยแล้ว
echo.

set /p REPO_URL="กรุณาวาง URL ของ GitHub Repository ของคุณ (เช่น https://github.com/yourname/unisync-ai.git): "

if "%REPO_URL%"=="" (
    echo [!] คุณไม่ได้ระบุ URL
    pause
    exit /b
)

echo.
echo กำลังเริ่มต้น Git Repository และอัปโหลดไฟล์...
git init
git add .
git commit -m "Deploy UniSync AI to GitHub Pages"
git branch -M main
git remote remove origin 2>nul
git remote add origin %REPO_URL%
git push -u origin main

echo.
echo ===================================================
echo   [✓] อัปโหลดขึ้น GitHub สำเร็จแล้ว!
echo ===================================================
echo.
echo ขั้นตอนต่อไปเพื่อเปิดหน้าเว็บ GitHub Pages:
echo 1. เข้าไปที่ Repository ของคุณบน GitHub
echo 2. ไปที่แท็บ Settings -> Pages
echo 3. ที่หัวข้อ 'Build and deployment' -> 'Source' ให้เลือก 'GitHub Actions'
echo 4. รอสักครู่ GitHub จะสร้างลิงก์เว็บไซต์ให้คุณนำไปแชร์ให้เพื่อนใช้งานได้ทันที!
echo.
pause
