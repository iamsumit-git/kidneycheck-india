#!/bin/bash
# KidneyCheck — Start both services
# Run from project root: bash start.sh

echo ""
echo "╔══════════════════════════════════════╗"
echo "║     KidneyCheck India — Starting     ║"
echo "╚══════════════════════════════════════╝"
echo ""

# Check models exist
if [ ! -f "ml-service/model/inbuilt_nb_model.pkl" ]; then
  echo "⚠  ML model files not found."
  echo ""
  echo "   Run these commands first:"
  echo "   git clone https://github.com/ap-atul/Chronic-Kidney-Disease ap-atul-ckd"
  echo "   cp ap-atul-ckd/model/inbuilt_nb_model.pkl  ml-service/model/"
  echo "   cp ap-atul-ckd/model/inbuilt_knn_model.pkl ml-service/model/"
  echo "   cp ap-atul-ckd/model/inbuilt_lr_model.pkl  ml-service/model/"
  echo ""
  echo "   Then run: bash start.sh"
  echo ""
  echo "   (Starting without ML — symptom scoring only)"
  echo ""
fi

# Check .env.local exists
if [ ! -f "frontend/.env.local" ]; then
  echo "⚠  frontend/.env.local not found."
  echo "   Copying from example..."
  cp frontend/.env.local.example frontend/.env.local
  echo "   Edit frontend/.env.local and add your ANTHROPIC_API_KEY"
  echo ""
fi

# Start ML service in background
echo "▶ Starting ML service (http://localhost:8000)..."
cd ml-service
pip install -r requirements.txt -q
python main.py &
ML_PID=$!
cd ..

# Wait for ML service to be ready
sleep 3
echo "✓ ML service running (PID: $ML_PID)"
echo ""

# Install frontend deps if needed
if [ ! -d "frontend/node_modules" ]; then
  echo "▶ Installing frontend dependencies..."
  cd frontend && npm install && cd ..
fi

# Start frontend
echo "▶ Starting frontend (http://localhost:3000)..."
echo ""
echo "╔══════════════════════════════════════╗"
echo "║  App:   http://localhost:3000        ║"
echo "║  ML:    http://localhost:8000        ║"
echo "║  Admin: http://localhost:3000/admin  ║"
echo "╚══════════════════════════════════════╝"
echo ""
cd frontend && npm run dev

# Cleanup on exit
trap "kill $ML_PID 2>/dev/null" EXIT
