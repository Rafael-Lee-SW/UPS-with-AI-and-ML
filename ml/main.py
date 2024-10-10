# main.py

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
import tensorflow as tf
from sklearn.preprocessing import MinMaxScaler
import joblib
from datetime import timedelta
import logging

logging.basicConfig(level=logging.INFO)
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

# Load the full data
# full_data = pd.read_csv('prepared_sales_data.csv', parse_dates=['purchase_date'])

# # Filter data to the last month
# today = full_data['purchase_date'].max()
# one_month_ago = today - timedelta(days=30)
# data = full_data[full_data['purchase_date'] >= one_month_ago].copy()
data = pd.read_csv(
    "prepared_sales_data_last_month.csv",
    parse_dates=["purchase_date"],
    dtype={"product_code": str},
)

# Ensure product_code is a string and strip whitespaces
data["product_code"] = data["product_code"].astype(str).str.strip()
# Print data information
print("Data types of data columns:")
print(data.dtypes)
print(f"Number of rows in data: {len(data)}")
print("Sample of product codes in data:")
print(data["product_code"].unique()[:10])  # Print first 10 unique product codes

locations = pd.read_csv("locations.csv", dtype={"id": int})

# load the model
lstm_model = tf.keras.models.load_model("lstm_sales_forecast_model.h5")
lstm_scaler = joblib.load("lstm_scaler.pkl")
rf_model = joblib.load("random_forest_sales_model.pkl")
label_encoder_product = joblib.load("label_encoder_product.pkl")
label_encoder_category = joblib.load("label_encoder_category.pkl")


# Utility functions
def get_last_week_sales(product_code):
    today = data["purchase_date"].max()
    last_week = today - timedelta(days=7)
    product_data = data[
        (data["product_code"] == product_code) & (data["purchase_date"] >= last_week)
    ]
    daily_sales = product_data.groupby(product_data["purchase_date"].dt.date)[
        "price"
    ].sum()
    return daily_sales


def forecast_next_week_sales(product_code):
    logging.info(f"Starting forecast for product_code: {product_code}")
    product_data = data[data["product_code"] == product_code].copy()

    logging.info(
        f"Number of entries for product_code {product_code}: {len(product_data)}"
    )

    # Check if product_data is empty
    if product_data.empty:
        logging.info(f"No data found for product_code: {product_code}")
        return None  # No data available for this product_code

    product_data.sort_values("purchase_date", inplace=True)
    sales_values = product_data[["price"]].values

    # Check if sales_values is empty
    if len(sales_values) == 0:
        return None  # No sales values available

    # Use saved scaler
    scaled_data = lstm_scaler.transform(sales_values)

    # Create sequences
    SEQ_LENGTH = 7
    if len(scaled_data) < SEQ_LENGTH:
        return None  # Not enough data for forecasting

    last_sequence = scaled_data[-SEQ_LENGTH:].reshape(1, SEQ_LENGTH, 1)
    future_forecast = []
    for _ in range(7):
        pred = lstm_model.predict(last_sequence)
        future_forecast.append(pred[0][0])
        last_sequence = np.concatenate(
            [last_sequence[:, 1:, :], pred.reshape(1, 1, 1)], axis=1
        )
    future_forecast = (
        lstm_scaler.inverse_transform(np.array(future_forecast).reshape(-1, 1))
        .flatten()
        .tolist()
    )
    return future_forecast


def get_top_n_sales(n=5):
    today = data["purchase_date"].max()
    last_week = today - timedelta(days=7)
    last_week_data = data[data["purchase_date"] >= last_week]
    top_products = (
        last_week_data.groupby("item_description")["price"]
        .sum()
        .sort_values(ascending=False)
        .head(n)
    )
    return top_products.reset_index().to_dict(orient="records")


def get_top_n_forecast(n=5):
    # For simplicity, we'll forecast for all products and pick top N
    product_codes = data["product_code"].unique()
    forecasts = []
    for product_code in product_codes:
        forecast = forecast_next_week_sales(product_code)
        if forecast:
            total_forecast = sum(forecast)
            product_name = data[data["product_code"] == product_code][
                "item_description"
            ].iloc[0]
            forecasts.append(
                {
                    "product_code": product_code,
                    "item_description": product_name,
                    "forecast_total": total_forecast,
                }
            )
    top_forecasts = sorted(forecasts, key=lambda x: x["forecast_total"], reverse=True)[
        :n
    ]
    return top_forecasts


def get_related_products(product_code):
    # Find products frequently bought together with the given product
    transactions = data[data["product_code"] == product_code]["id"].unique()
    related_products = data[
        data["id"].isin(transactions) & (data["product_code"] != product_code)
    ]
    top_related = related_products["item_description"].value_counts().head(5)
    return (
        top_related.reset_index()
        .rename(columns={"index": "item_description", "item_description": "count"})
        .to_dict(orient="records")
    )


def analyze_customer_preferences():
    # Example: Find top products for different age groups or genders
    preferences = (
        data.groupby(["age_group", "item_description"])["price"].sum().reset_index()
    )
    top_preferences = preferences.groupby("age_group").apply(
        lambda x: x.sort_values("price", ascending=False).head(1)
    )
    return top_preferences.to_dict(orient="records")


def recommend_product_placement(data, locations):
    # Analyze transaction paths to recommend product placement

    # Create a transaction group to simulate customer paths
    data["transaction_group"] = data.groupby(["person_id", "purchase_date"])[
        "id"
    ].transform("min")
    transaction_paths = (
        data.groupby("transaction_group")["location_id"].apply(list).reset_index()
    )

    location_pairs = []
    for path in transaction_paths["location_id"]:
        for i in range(len(path) - 1):
            from_location = path[i]
            to_location = path[i + 1]
            if from_location != to_location:
                pair = (from_location, to_location)
                location_pairs.append(pair)

    # Count the frequency of each location pair
    pair_counts = pd.Series(location_pairs).value_counts().reset_index()
    pair_counts.columns = ["pair", "count"]

    # Filter out pairs where from_location and to_location are the same (redundant after the above check)
    # (This step is optional since we already ensured from_location != to_location)

    # Generate recommendations
    recommendations = []
    total_counts = pair_counts["count"].sum()
    for idx, row in pair_counts.head(5).iterrows():
        from_location_id = row["pair"][0]
        to_location_id = row["pair"][1]

        # Retrieve location names
        from_location_name = locations[locations["id"] == from_location_id][
            "name"
        ].values[0]
        to_location_name = locations[locations["id"] == to_location_id]["name"].values[
            0
        ]

        effectiveness = row["count"] / total_counts

        recommendations.append(
            {
                "from_location_id": int(from_location_id),
                "from_location_name": from_location_name,
                "to_location_id": int(to_location_id),
                "to_location_name": to_location_name,
                "effectiveness": effectiveness,
            }
        )

    return recommendations


# API endpoints


@app.get("/sales/last_week/{product_code}")
async def api_last_week_sales(product_code: str):
    product_code = product_code.strip() + ".0"
    sales = get_last_week_sales(product_code)
    if sales.empty:
        raise HTTPException(
            status_code=404, detail="Product not found or no sales in last week."
        )
    return sales.to_dict()


@app.get("/sales/forecast/{product_code}")
async def api_forecast_sales(product_code: str):
    # Append '.0' to the product code to match the format in the dataset
    product_code = product_code.strip() + ".0"
    forecast = forecast_next_week_sales(product_code)
    if not forecast:
        raise HTTPException(
            status_code=404,
            detail="Product not found or not enough data for forecasting.",
        )
    return {"forecast": forecast}


@app.get("/report/top_products/last_week")
async def api_top_products_last_week():
    top_products = get_top_n_sales()
    return {"top_products": top_products}


@app.get("/report/top_products/forecast")
async def api_top_products_forecast():
    top_forecasts = get_top_n_forecast()
    return {"top_forecasts": top_forecasts}


@app.get("/products/related/{product_code}")
async def api_related_products(product_code: str):
    product_code = product_code.strip() + ".0"
    related_products = get_related_products(product_code)
    return {"related_products": related_products}


@app.get("/report/customer_preferences")
async def api_customer_preferences():
    preferences = analyze_customer_preferences()
    return {"customer_preferences": preferences}


@app.get("/report/product_placement")
async def api_product_placement():
    recommendations = recommend_product_placement(data, locations)
    return {"placement_recommendations": recommendations}
