"""
KidneyCheck ML Service
Wraps pre-trained models from: https://github.com/ap-atul/Chronic-Kidney-Disease

SETUP:
1. Clone the ap-atul repo:
   git clone https://github.com/ap-atul/Chronic-Kidney-Disease ap-atul-ckd

2. Copy the model files into this directory:
   cp ap-atul-ckd/model/inbuilt_nb_model.pkl  ./model/
   cp ap-atul-ckd/model/inbuilt_knn_model.pkl ./model/
   cp ap-atul-ckd/model/inbuilt_lr_model.pkl  ./model/

3. Install dependencies:
   pip install -r requirements.txt

4. Run:
   python main.py
   OR
   uvicorn main:app --reload --port 8000

API will be available at: http://localhost:8000
Docs at: http://localhost:8000/docs
"""

import os
import joblib
import numpy as np
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

app = FastAPI(title="KidneyCheck ML Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── UCI CKD dataset medians for imputation ─────────────────────────────────
# These are precomputed from the UCI CKD dataset (Tamil Nadu hospital data)
# Used to fill missing values when user hasn't provided lab data
UCI_MEDIANS = {
    "age":   51.0,
    "bp":    80.0,
    "sg":    1.020,
    "al":    0.0,
    "su":    0.0,
    "bgr":   121.0,
    "bu":    42.0,
    "sc":    1.2,
    "sod":   138.0,
    "pot":   4.4,
    "hemo":  12.5,
    "pcv":   38.0,
    "wc":    8000.0,
    "rc":    4.6,
}

UCI_MODES = {
    "rbc":   "normal",
    "pc":    "normal",
    "pcc":   "notpresent",
    "ba":    "notpresent",
    "htn":   "no",
    "dm":    "no",
    "cad":   "no",
    "appet": "good",
    "pe":    "no",
    "ane":   "no",
}

# ── Feature encoding ────────────────────────────────────────────────────────
NOMINAL_ENCODING = {
    "rbc":   {"normal": 1, "abnormal": 0},
    "pc":    {"normal": 1, "abnormal": 0},
    "pcc":   {"notpresent": 0, "present": 1},
    "ba":    {"notpresent": 0, "present": 1},
    "htn":   {"no": 0, "yes": 1},
    "dm":    {"no": 0, "yes": 1},
    "cad":   {"no": 0, "yes": 1},
    "appet": {"good": 1, "poor": 0},
    "pe":    {"no": 0, "yes": 1},
    "ane":   {"no": 0, "yes": 1},
}

# Feature order expected by the ap-atul model
FEATURE_ORDER = [
    "age", "bp", "sg", "al", "su",
    "rbc", "pc", "pcc", "ba",
    "bgr", "bu", "sc", "sod", "pot",
    "hemo", "pcv", "wc", "rc",
    "htn", "dm", "cad", "appet", "pe", "ane"
]

# ── Load models ─────────────────────────────────────────────────────────────
MODEL_DIR = os.path.join(os.path.dirname(__file__), "model")
models = {}

MODEL_FILES = {
    "naive_bayes": ["inbuilt_nb_model.pkl", "nb_model_inbuilt.joblib", "nb_model_inbuilt.pkl"],
    "knn":         ["inbuilt_knn_model.pkl", "knn_model_inbuilt.joblib", "knn_model_inbuilt.pkl"],
    "logistic":    ["inbuilt_lr_model.pkl", "lr_model_inbuilt.joblib", "lr_model_inbuilt.pkl"],
}

for name, filenames in MODEL_FILES.items():
    if isinstance(filenames, str):
        filenames = [filenames]
    for filename in filenames:
        path = os.path.join(MODEL_DIR, filename)
        if os.path.exists(path):
            try:
                models[name] = joblib.load(path)
                print(f"✓ Loaded {name} from {filename}")
                break
            except Exception as e:
                print(f"✗ Failed to load {name} from {filename}: {e}")
    if name not in models:
        print(f"⚠ {name} not loaded — run: python retrain_models.py")

# ── Request schema ───────────────────────────────────────────────────────────
class PredictRequest(BaseModel):
    # From 10 questions (mapped by frontend)
    age:    Optional[float] = None
    bp:     Optional[float] = None
    dm:     Optional[str]   = None   # "yes" | "no"
    htn:    Optional[str]   = None   # "yes" | "no"
    pe:     Optional[str]   = None   # "yes" | "no"
    ane:    Optional[str]   = None   # "yes" | "no"
    appet:  Optional[str]   = None   # "good" | "poor"
    cad:    Optional[str]   = None   # "yes" | "no"

    # Optional lab values (from lab-values page)
    sc:     Optional[float] = None   # serum creatinine
    bgr:    Optional[float] = None   # blood glucose random
    bu:     Optional[float] = None   # blood urea
    hemo:   Optional[float] = None   # haemoglobin
    sod:    Optional[float] = None   # sodium
    pot:    Optional[float] = None   # potassium
    pcv:    Optional[float] = None   # packed cell volume
    wc:     Optional[float] = None   # white cell count
    rc:     Optional[float] = None   # red cell count
    sg:     Optional[float] = None   # specific gravity
    al:     Optional[float] = None   # albumin
    su:     Optional[float] = None   # sugar


def build_feature_vector(data: dict) -> tuple[list, int, int]:
    """Build the 24-feature vector expected by the model, counting provided vs imputed."""
    provided = 0
    imputed  = 0
    vector   = []

    numeric_fields = ["age", "bp", "sg", "al", "su", "bgr", "bu", "sc", "sod", "pot", "hemo", "pcv", "wc", "rc"]
    nominal_fields = ["rbc", "pc", "pcc", "ba", "htn", "dm", "cad", "appet", "pe", "ane"]

    # Build raw values dict
    raw = {k: v for k, v in data.items() if v is not None}

    for feat in FEATURE_ORDER:
        if feat in numeric_fields:
            val = raw.get(feat)
            if val is not None:
                vector.append(float(val))
                provided += 1
            else:
                vector.append(UCI_MEDIANS[feat])
                imputed += 1

        elif feat in nominal_fields:
            val = raw.get(feat, "").lower().strip()
            encoding = NOMINAL_ENCODING.get(feat, {})
            if val in encoding:
                vector.append(float(encoding[val]))
                provided += 1
            else:
                # Use mode (most common value)
                mode_val = UCI_MODES[feat]
                vector.append(float(encoding.get(mode_val, 0)))
                imputed += 1

    return vector, provided, imputed


def get_reliability(provided: int, imputed: int) -> str:
    total = provided + imputed
    ratio = provided / total if total > 0 else 0
    if ratio >= 0.7:  return "high"
    if ratio >= 0.35: return "moderate"
    return "low"


# ── Endpoints ────────────────────────────────────────────────────────────────
@app.get("/")
def health():
    return {
        "status": "running",
        "models_loaded": list(models.keys()),
        "models_missing": [n for n in MODEL_FILES if n not in models],
    }


@app.post("/predict")
def predict(req: PredictRequest):
    if not models:
        return {
            "prediction": "unavailable",
            "confidence": 0.0,
            "reliability": "unavailable",
            "features_provided": 0,
            "features_imputed": 24,
            "error": "No models loaded. See setup instructions in main.py.",
        }

    data = req.model_dump()
    vector, provided, imputed = build_feature_vector(data)
    X = np.array([vector])

    # Primary model: Naive Bayes (100% accuracy on UCI dataset)
    # Fallback: KNN, then Logistic Regression
    primary = "naive_bayes" if "naive_bayes" in models else list(models.keys())[0]
    model   = models[primary]

    prediction_raw = model.predict(X)[0]
    prediction     = "ckd" if str(prediction_raw).lower() in ["ckd", "1", "1.0"] else "notckd"

    confidence = 0.85  # default
    if hasattr(model, "predict_proba"):
        proba      = model.predict_proba(X)[0]
        confidence = float(max(proba))

    # Cross-validate with KNN if available
    cross_check = None
    if "knn" in models and primary != "knn":
        knn_pred    = models["knn"].predict(X)[0]
        cross_check = "ckd" if str(knn_pred).lower() in ["ckd", "1", "1.0"] else "notckd"

    return {
        "prediction":        prediction,
        "confidence":        round(confidence, 4),
        "reliability":       get_reliability(provided, imputed),
        "features_provided": provided,
        "features_imputed":  imputed,
        "model_used":        primary,
        "cross_check":       cross_check,
    }


@app.post("/predict/all-models")
def predict_all(req: PredictRequest):
    """Run prediction on all loaded models — useful for Dr. Dedhia demo."""
    data = req.model_dump()
    vector, provided, imputed = build_feature_vector(data)
    X = np.array([vector])

    results = {}
    for name, model in models.items():
        pred_raw  = model.predict(X)[0]
        pred      = "ckd" if str(pred_raw).lower() in ["ckd", "1", "1.0"] else "notckd"
        conf      = 0.85
        if hasattr(model, "predict_proba"):
            conf = float(max(model.predict_proba(X)[0]))
        results[name] = {"prediction": pred, "confidence": round(conf, 4)}

    return {
        "models": results,
        "features_provided": provided,
        "features_imputed":  imputed,
        "reliability":       get_reliability(provided, imputed),
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
