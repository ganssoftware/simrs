# ==========================================
# SIMRS - Git Push
# ==========================================

$ErrorActionPreference = "Stop"

Write-Host "======================================" -ForegroundColor Cyan
Write-Host " SIMRS - Git Push" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan

# ==========================================
# Git Identity
# ==========================================

git config user.name "ganssoftware"
git config user.email "ganssoftware1@gmail.com"

Write-Host ""
Write-Host "Git User : ganssoftware" -ForegroundColor Green
Write-Host "Git Email: ganssoftware1@gmail.com" -ForegroundColor Green

# ==========================================
# Initialize Git
# ==========================================

git init

# ==========================================
# README
# ==========================================

if (-not (Test-Path "README.md")) {
    "# simrs" | Out-File -Encoding utf8 "README.md"
    Write-Host "README.md dibuat." -ForegroundColor Yellow
}

# ==========================================
# .gitignore
# ==========================================

if (-not (Test-Path ".gitignore")) {
    @"
# Environment
.env
.env.*
!.env.example

# Dependencies
node_modules/

# Build
dist/
build/

# Logs
*.log

# Uploads
uploads/

# OS
.DS_Store
Thumbs.db
"@ | Out-File -Encoding utf8 ".gitignore"

    Write-Host ".gitignore dibuat." -ForegroundColor Yellow
}
else {
    # Pastikan .env ada di .gitignore
    $gitignoreContent = Get-Content ".gitignore"

    if ($gitignoreContent -notcontains ".env") {
        Add-Content ".gitignore" "`n# Environment`n.env"
        Write-Host ".env ditambahkan ke .gitignore." -ForegroundColor Yellow
    }
}

# ==========================================
# Remove .env from Git Tracking
# ==========================================

Write-Host ""
Write-Host "Memeriksa .env..." -ForegroundColor Cyan

if (Test-Path ".env") {
    git rm --cached --ignore-unmatch ".env" 2>$null
    Write-Host ".env tidak akan di-push ke GitHub." -ForegroundColor Green
}

# ==========================================
# Branch
# ==========================================

git branch -M main

# ==========================================
# Remote Repository
# ==========================================

$remoteUrl = "https://github.com/ganssoftware/simrs.git"

$remotes = @(git remote)

if ($remotes -contains "origin") {
    git remote set-url origin $remoteUrl
    Write-Host "Remote origin diperbarui." -ForegroundColor Green
}
else {
    git remote add origin $remoteUrl
    Write-Host "Remote origin ditambahkan." -ForegroundColor Green
}

# ==========================================
# Add Files
# ==========================================

Write-Host ""
Write-Host "Menambahkan file..." -ForegroundColor Cyan

git add .

# ==========================================
# Commit
# ==========================================

Write-Host ""
Write-Host "Membuat commit..." -ForegroundColor Cyan

git commit -m "third commit"

# ==========================================
# Push
# ==========================================

Write-Host ""
Write-Host "Push ke GitHub..." -ForegroundColor Cyan

git push -u origin main

Write-Host ""
Write-Host "======================================" -ForegroundColor Green
Write-Host " Push berhasil!" -ForegroundColor Green
Write-Host " .env aman dan tidak di-push." -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green
