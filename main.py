import joblib
import pandas as pd

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


# Load Machine Learning Model
model = joblib.load("Car-Prediction-Model.pkl")


# Create FastAPI Application
app = FastAPI(
    title="Car Price Prediction API",
    description="Predict used car prices using Machine Learning",
    version="1.0"
)


# CORS Configuration (Frontend-Backend Connection)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Input Data Validation
class CarData(BaseModel):

    name: str
    company: str
    year: int = Field(ge=1900, le=2026)
    kms_driven: int = Field(ge=0)
    fuel_type: str


# Home Route
@app.get("/")
def home():
    return {
        "message": "Welcome to Car Price Prediction API",
        "status": "API is running successfully"
    }


# Prediction Route
@app.post("/predict")
def predict_price(data: CarData):

    try:

        # Convert input data into DataFrame
        input_data = pd.DataFrame([data.model_dump()])

        # Predict car price
        prediction = model.predict(input_data)

        # Extract predicted price
        predicted_price = float(prediction[0])

        # Return prediction
        return {
            "predicted_price": round(predicted_price, 2)
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(e)}"
        )