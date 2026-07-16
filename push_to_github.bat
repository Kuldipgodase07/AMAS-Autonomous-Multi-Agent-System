@echo off
title Push to GitHub - AMAS Autonomous Multi-Agent System
color 0A

echo.
echo ============================================================
echo   AMAS - Autonomous Multi-Agent System
echo   GitHub Push Script
echo ============================================================
echo.

:: -------------------------------------------------------
:: CONFIG - Set your GitHub Personal Access Token below
:: -------------------------------------------------------
set GITHUB_USERNAME=Kuldipgodase07
set GITHUB_REPO=AMAS-Autonomous-Multi-Agent-System
set GITHUB_TOKEN=YOUR_PERSONAL_ACCESS_TOKEN_HERE

:: -------------------------------------------------------
:: If token not set, prompt the user
:: -------------------------------------------------------
if "%GITHUB_TOKEN%"=="YOUR_PERSONAL_ACCESS_TOKEN_HERE" (
    echo [!] GitHub Token not set in the script.
    echo     Get one from: https://github.com/settings/tokens
    echo     Required scope: repo
    echo.
    set /p GITHUB_TOKEN="Paste your GitHub Personal Access Token: "
    echo.
)

:: -------------------------------------------------------
:: Set remote URL with token
:: -------------------------------------------------------
git remote set-url origin https://%GITHUB_USERNAME%:%GITHUB_TOKEN%@github.com/%GITHUB_USERNAME%/%GITHUB_REPO%.git

:: -------------------------------------------------------
:: Ask for commit message
:: -------------------------------------------------------
set /p COMMIT_MSG="Enter commit message (or press Enter for default): "
if "%COMMIT_MSG%"=="" set COMMIT_MSG=Update: %DATE% %TIME%

echo.
echo [1/4] Staging all changes...
git add .

echo [2/4] Committing with message: "%COMMIT_MSG%"
git commit -m "%COMMIT_MSG%"

echo [3/4] Switching to main branch...
git branch -M main

echo [4/4] Pushing to GitHub...
git push -u origin main --force

echo.
if %ERRORLEVEL% EQU 0 (
    color 0A
    echo ============================================================
    echo   SUCCESS! Code pushed to GitHub successfully!
    echo   https://github.com/%GITHUB_USERNAME%/%GITHUB_REPO%
    echo ============================================================
) else (
    color 0C
    echo ============================================================
    echo   ERROR! Push failed. Check your token and internet.
    echo ============================================================
)

echo.
pause
