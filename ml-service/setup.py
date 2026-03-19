#!/usr/bin/env python3
"""
KidneyCheck ML Setup Script
Clones the ap-atul/Chronic-Kidney-Disease repo and copies
pre-trained model files into the ml-service/model/ directory.

Run this once before starting the ML service:
  python setup.py
"""

import os
import sys
import shutil
import subprocess

BASE_DIR   = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR  = os.path.join(BASE_DIR, "model")
REPO_DIR   = os.path.join(BASE_DIR, "ap-atul-ckd")
REPO_URL   = "https://github.com/ap-atul/Chronic-Kidney-Disease"

MODEL_FILES = {
    "inbuilt_nb_model.pkl":  "Naive Bayes  (100% accuracy)",
    "inbuilt_knn_model.pkl": "KNN          (90.62% accuracy)",
    "inbuilt_lr_model.pkl":  "Logistic Reg (100% accuracy)",
}

def run(cmd, cwd=None):
    result = subprocess.run(cmd, shell=True, cwd=cwd, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"ERROR: {result.stderr}")
        sys.exit(1)
    return result.stdout.strip()

def main():
    os.makedirs(MODEL_DIR, exist_ok=True)

    # ── Step 1: Clone or pull the ap-atul repo ──────────────────────────────
    if os.path.exists(REPO_DIR):
        print("Repository already cloned. Pulling latest...")
        run("git pull", cwd=REPO_DIR)
    else:
        print(f"Cloning {REPO_URL} ...")
        run(f"git clone {REPO_URL} ap-atul-ckd", cwd=BASE_DIR)

    print("Repository ready.")

    # ── Step 2: Locate model files ──────────────────────────────────────────
    source_model_dir = os.path.join(REPO_DIR, "model")

    if not os.path.exists(source_model_dir):
        print(f"\nERROR: model/ folder not found in cloned repo at {source_model_dir}")
        print("The repo structure may have changed. Check manually:")
        print(f"  ls {REPO_DIR}")
        sys.exit(1)

    found = os.listdir(source_model_dir)
    print(f"\nFound model files: {found}")

    # ── Step 3: Copy model files ────────────────────────────────────────────
    print("\nCopying pre-trained models...")
    copied = 0

    for filename, description in MODEL_FILES.items():
        src = os.path.join(source_model_dir, filename)
        dst = os.path.join(MODEL_DIR, filename)

        if os.path.exists(src):
            shutil.copy2(src, dst)
            print(f"  ✓ {filename}  ({description})")
            copied += 1
        else:
            # Try to find a similarly named file
            matches = [f for f in found if filename.split("_")[1] in f.lower()]
            if matches:
                src = os.path.join(source_model_dir, matches[0])
                shutil.copy2(src, dst)
                print(f"  ✓ {matches[0]} → {filename}  ({description})")
                copied += 1
            else:
                print(f"  ✗ {filename} not found — will be skipped")

    # ── Step 4: Copy dataset for reference ─────────────────────────────────
    dataset_src = os.path.join(REPO_DIR, "dataset")
    dataset_dst = os.path.join(BASE_DIR, "dataset")
    if os.path.exists(dataset_src) and not os.path.exists(dataset_dst):
        shutil.copytree(dataset_src, dataset_dst)
        print(f"\n  ✓ Dataset copied to ml-service/dataset/")

    # ── Summary ─────────────────────────────────────────────────────────────
    print(f"\n{'─'*50}")
    print(f"Setup complete. {copied}/{len(MODEL_FILES)} models copied.")
    print(f"Model files saved to: {MODEL_DIR}")

    if copied == 0:
        print("\nWARNING: No models were copied.")
        print("Check the repo structure and copy .pkl files manually to:")
        print(f"  {MODEL_DIR}")
    else:
        print("\nNext step — start the ML service:")
        print("  pip install -r requirements.txt")
        print("  python main.py")
        print("\nML API will be live at: http://localhost:8000")
        print("API docs at:            http://localhost:8000/docs")

if __name__ == "__main__":
    main()
