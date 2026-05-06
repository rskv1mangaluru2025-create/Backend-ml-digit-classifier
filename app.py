# app.py
import os
import joblib
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from model_train import train # Import the train function from our script

# Initialize FastAPI app
app = FastAPI(title="Dance School Style Predictor")

# Enable CORS for all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Label mapping
DANCE_STYLES = {
    0: "Ballet",
    1: "Hip Hop",
    2: "Jazz",
    3: "Salsa"
}

# Input data model
class StudentData(BaseModel):
    age: int
    experience: int
    flexibility: int

# Persistence: Load model on startup or train if missing
MODEL_PATH = "model.pkl"
model = None

@app.on_event("startup")
def load_model():
    global model
    if not os.path.exists(MODEL_PATH):
        print("Model file not found. Training model now...")
        train()
    
    model = joblib.load(MODEL_PATH)
    print("Model loaded successfully.")

# Root endpoint for health check
@app.get("/")
def read_root():
    return {"status": "running", "message": "Dance Academy ML API"}

# Prediction endpoint
@app.post("/predict")
async def predict(data: StudentData):
    if model is None:
        raise HTTPException(status_code=500, detail="Model not initialized")
    
    try:
        # Prepare input for scikit-learn
        features = np.array([[data.age, data.experience, data.flexibility]])
        
        # Get prediction
        prediction_id = int(model.predict(features)[0])
        style_name = DANCE_STYLES.get(prediction_id, "Unknown")
        
        # Get confidence (if model supports it, DecisionTree does)
        # Note: Decision trees give probabilities based on leaf nodes
        probabilities = model.predict_proba(features)[0]
        confidence = float(np.max(probabilities))
        
        return {
            "prediction": style_name,
            "confidence": confidence,
            "inputs": {
                "age": data.age,
                "experience": data.experience,
                "flexibility": data.flexibility
            }
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    # Use port 3000 as per environment constraints for the dev server
    uvicorn.run(app, host="0.0.0.0", port=3000)
