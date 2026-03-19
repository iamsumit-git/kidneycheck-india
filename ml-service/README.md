# KidneyCheck ML Service

FastAPI wrapping pre-trained CKD models from ap-atul/Chronic-Kidney-Disease (MIT).

## Setup
```bash
# 1. Clone ap-atul repo and copy models
git clone https://github.com/ap-atul/Chronic-Kidney-Disease ap-atul-ckd
cp ap-atul-ckd/model/inbuilt_nb_model.pkl  ./model/
cp ap-atul-ckd/model/inbuilt_knn_model.pkl ./model/
cp ap-atul-ckd/model/inbuilt_lr_model.pkl  ./model/

# 2. Install and run
pip install -r requirements.txt
python main.py
```

## Models: Naive Bayes 100%, KNN 90.62%, Logistic Regression 100%
## API Docs: http://localhost:8000/docs
