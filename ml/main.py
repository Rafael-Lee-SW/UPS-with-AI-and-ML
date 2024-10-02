from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import numpy as np
import tensorflow as tf  # or import your specific ML library
# Import other necessary libraries

# Define input data model
class PredictionRequest(BaseModel):
    # Replace with your actual input features
    feature1: float
    feature2: float
    # Add more features as required

app = FastAPI()

# Load your ML model
model = tf.keras.models.load_model('lstm_sales_forecast_model.h5')  # Replace with your model file

@app.post("/predict")
async def predict(request: PredictionRequest):
    try:
        # Prepare input data for prediction
        input_data = np.array([[request.feature1, request.feature2]])  # Adjust according to your model's input shape

        # Make prediction
        prediction = model.predict(input_data)

        # Process prediction result
        result = prediction.tolist()

        return {"prediction": result}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
