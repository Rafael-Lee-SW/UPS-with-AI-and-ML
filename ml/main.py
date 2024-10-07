# main.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import numpy as np
import tensorflow as tf  # or import your specific ML library
from report_generation import generate_forecasting_data, get_top_100_products
from product_search import search_and_forecast

# Import other necessary libraries


# Define input data model
class PredictionRequest(BaseModel):
    # Replace with your actual input features
    feature1: float
    feature2: float
    # Add more features as required


app = FastAPI(root_path="/ml")

# Define the list of origins that are allowed to make cross-origin requests
origins = [
    "http://localhost:3000",  # Your frontend development server
    "https://j11a302.p.ssafy.io",  # If your frontend is also served from this domain
    # Add any other origins as needed
]

# Add CORS middleware to your FastAPI app
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # List of origins that are allowed
    allow_credentials=True,
    allow_methods=["*"],  # Allowed HTTP methods, e.g., GET, POST
    allow_headers=["*"],  # Allowed HTTP headers
)

# Replace with your model file
lstm_model = tf.keras.models.load_model("lstm_sales_forecast_model.h5")


@app.get("/health")
async def health_check():
    return {"status": "OK"}


# Load data and models at startup


# Pass data and model to functions
@app.get("/forecasting")
async def get_forecasting_data():
    try:
        data_output = generate_forecasting_data()
        return data_output
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/products/{product_code}")
async def get_product_forecast(product_code: str):
    try:
        result = search_and_forecast(product_code)
        if result is None:
            raise HTTPException(status_code=404, detail="Product not found.")
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/top100products")
async def get_top_100_products_endpoint():
    try:
        top_products = get_top_100_products()
        return {"top_100_products": top_products}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/predict")
async def predict(request: PredictionRequest):
    try:
        # Prepare input data for prediction
        input_data = np.array(
            [[request.feature1, request.feature2]]
        )  # Adjust according to your model's input shape

        # Make prediction
        prediction = model.predict(input_data)

        # Process prediction result
        result = prediction.tolist()

        return {"prediction": result}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
