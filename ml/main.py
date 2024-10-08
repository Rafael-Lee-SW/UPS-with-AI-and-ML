# main.py

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
import tensorflow as tf
from sklearn.preprocessing import MinMaxScaler
import joblib
from datetime import timedelta

# Load models and data at startup
app = FastAPI(root_path="/ml")

# CORS settings
origins = [
    "http://localhost:3000",
    "https://j11a302.p.ssafy.io",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load data and models
data = pd.read_csv('prepared_sales_data.csv', parse_dates=['purchase_date'])
locations = pd.read_csv('locations.csv')
lstm_model = tf.keras.models.load_model('lstm_sales_forecast_model.h5')
lstm_scaler = joblib.load('lstm_scaler.pkl')
rf_model = joblib.load('random_forest_sales_model.pkl')
label_encoder_product = joblib.load('label_encoder_product.pkl')
label_encoder_category = joblib.load('label_encoder_category.pkl')

# Utility functions
def get_last_week_sales(product_code):
    today = data['purchase_date'].max()
    last_week = today - timedelta(days=7)
    product_data = data[(data['product_code'] == product_code) & (data['purchase_date'] >= last_week)]
    daily_sales = product_data.groupby(product_data['purchase_date'].dt.date)['price'].sum()
    return daily_sales

def forecast_next_week_sales(product_code):
    product_data = data[data['product_code'] == product_code].copy()
    product_data.sort_values('purchase_date', inplace=True)
    sales_values = product_data[['price']].values

    # Use saved scaler
    scaled_data = lstm_scaler.transform(sales_values)

    # Create sequences
    SEQ_LENGTH = 7
    if len(scaled_data) < SEQ_LENGTH:
        return None  # Not enough data
    last_sequence = scaled_data[-SEQ_LENGTH:].reshape(1, SEQ_LENGTH, 1)
    future_forecast = []
    for _ in range(7):
        pred = lstm_model.predict(last_sequence)
        future_forecast.append(pred[0][0])
        last_sequence = np.concatenate([last_sequence[:, 1:, :], pred.reshape(1, 1, 1)], axis=1)
    future_forecast = lstm_scaler.inverse_transform(np.array(future_forecast).reshape(-1, 1)).flatten().tolist()
    return future_forecast

def get_top_n_sales(n=5):
    today = data['purchase_date'].max()
    last_week = today - timedelta(days=7)
    last_week_data = data[data['purchase_date'] >= last_week]
    top_products = last_week_data.groupby('item_description')['price'].sum().sort_values(ascending=False).head(n)
    return top_products.reset_index().to_dict(orient='records')

def get_top_n_forecast(n=5):
    # For simplicity, we'll forecast for all products and pick top N
    product_codes = data['product_code'].unique()
    forecasts = []
    for product_code in product_codes:
        forecast = forecast_next_week_sales(product_code)
        if forecast:
            total_forecast = sum(forecast)
            product_name = data[data['product_code'] == product_code]['item_description'].iloc[0]
            forecasts.append({'product_code': product_code, 'item_description': product_name, 'forecast_total': total_forecast})
    top_forecasts = sorted(forecasts, key=lambda x: x['forecast_total'], reverse=True)[:n]
    return top_forecasts

def get_related_products(product_code):
    # Find products frequently bought together with the given product
    transactions = data[data['product_code'] == product_code]['id'].unique()
    related_products = data[data['id'].isin(transactions) & (data['product_code'] != product_code)]
    top_related = related_products['item_description'].value_counts().head(5)
    return top_related.reset_index().rename(columns={'index': 'item_description', 'item_description': 'count'}).to_dict(orient='records')

def analyze_customer_preferences():
    # Example: Find top products for different age groups or genders
    preferences = data.groupby(['age_group', 'item_description'])['price'].sum().reset_index()
    top_preferences = preferences.groupby('age_group').apply(lambda x: x.sort_values('price', ascending=False).head(1))
    return top_preferences.to_dict(orient='records')

def recommend_product_placement():
    # Simplified example: Suggest swapping locations of top connected products
    # This requires more complex analysis; we'll provide a placeholder
    recommendations = [{'from_location': 'LocationA', 'to_location': 'LocationB', 'effectiveness': 0.85}]
    return recommendations

# API endpoints

@app.get("/sales/last_week/{product_code}")
async def api_last_week_sales(product_code: str):
    sales = get_last_week_sales(product_code)
    if sales.empty:
        raise HTTPException(status_code=404, detail="Product not found or no sales in last week.")
    return sales.to_dict()

@app.get("/sales/forecast/{product_code}")
async def api_forecast_sales(product_code: str):
    forecast = forecast_next_week_sales(product_code)
    if not forecast:
        raise HTTPException(status_code=404, detail="Product not found or not enough data for forecasting.")
    return {'forecast': forecast}

@app.get("/report/top_products/last_week")
async def api_top_products_last_week():
    top_products = get_top_n_sales()
    return {'top_products': top_products}

@app.get("/report/top_products/forecast")
async def api_top_products_forecast():
    top_forecasts = get_top_n_forecast()
    return {'top_forecasts': top_forecasts}

@app.get("/products/related/{product_code}")
async def api_related_products(product_code: str):
    related_products = get_related_products(product_code)
    return {'related_products': related_products}

@app.get("/report/customer_preferences")
async def api_customer_preferences():
    preferences = analyze_customer_preferences()
    return {'customer_preferences': preferences}

@app.get("/report/product_placement")
async def api_product_placement():
    recommendations = recommend_product_placement()
    return {'placement_recommendations': recommendations}

