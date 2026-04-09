# Check if Python is installed
if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
    Write-Error "Python is not installed or not in your PATH. Please install Python 3.11+."
    exit 1
}

Write-Host "Setting up Python backend for local development..." -ForegroundColor Cyan

# Create virtual environment if it doesn't exist
if (-not (Test-Path "venv")) {
    Write-Host "Creating virtual environment..." -ForegroundColor Yellow
    python -m venv venv
}

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Yellow
if ($IsWindows) {
    .\venv\Scripts\Activate.ps1
} else {
    source venv/bin/activate
}

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
pip install -r requirements.txt

# Run the server
Write-Host "Starting FastAPI server..." -ForegroundColor Green
Write-Host "API Docs available at: http://localhost:3000/docs" -ForegroundColor Green
uvicorn app.main:app --host 0.0.0.0 --port 3000 --reload
