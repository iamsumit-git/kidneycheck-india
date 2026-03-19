@echo off
echo.
echo ==========================================
echo     KidneyCheck India - Starting...
echo ==========================================
echo.

:: Check if model files exist
IF NOT EXIST "ml-service\model\inbuilt_nb_model.pkl" (
    echo WARNING: ML model files not found.
    echo.
    echo Run these commands first:
    echo   git clone https://github.com/ap-atul/Chronic-Kidney-Disease ap-atul-ckd
    echo   copy ap-atul-ckd\model\inbuilt_nb_model.pkl  ml-service\model\
    echo   copy ap-atul-ckd\model\inbuilt_knn_model.pkl ml-service\model\
    echo   copy ap-atul-ckd\model\inbuilt_lr_model.pkl  ml-service\model\
    echo.
    echo Starting without ML - symptom scoring only
    echo.
)

:: Check if .env.local exists
IF NOT EXIST "frontend\.env.local" (
    echo Copying .env.local.example to .env.local...
    copy "frontend\.env.local.example" "frontend\.env.local"
    echo.
    echo IMPORTANT: Open frontend\.env.local and add your ANTHROPIC_API_KEY
    echo Get a free key at: console.anthropic.com
    echo.
    pause
)

:: Start ML service in a new window
echo Starting ML service on http://localhost:8000 ...
start "KidneyCheck ML Service" cmd /k "cd ml-service && pip install -r requirements.txt && python main.py"

:: Wait 4 seconds for ML service to boot
echo Waiting for ML service to start...
timeout /t 4 /nobreak >nul

:: Install frontend deps if node_modules missing
IF NOT EXIST "frontend\node_modules" (
    echo Installing frontend dependencies...
    cd frontend && npm install && cd ..
)

:: Start frontend in a new window
echo Starting frontend on http://localhost:3000 ...
start "KidneyCheck Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ==========================================
echo  App:    http://localhost:3000
echo  ML API: http://localhost:8000
echo  Admin:  http://localhost:3000/admin
echo  Docs:   http://localhost:8000/docs
echo ==========================================
echo.
echo Two windows have opened - one for each service.
echo Keep both windows running.
echo.
echo Press any key to open the app in your browser...
pause >nul
start http://localhost:3000
