import pandas as pd
import numpy as np
import tensorflow as tf
from sklearn.preprocessing import MinMaxScaler

# Load data and models
data = pd.read_csv('prepared_sales_data.csv', parse_dates=['purchase_date'])
lstm_model = tf.keras.models.load_model('lstm_sales_forecast_model.h5')

def generate_forecasting_data():
    # Prepare data structures to hold the results
    report_data = {
        "top_products_forecasting": [],
        "top_locations": [],
        "top_categories_forecasting": []
    }

    # Generate Top 10 products by sales amount
    top_products = data.groupby('item_description')['price'].sum().sort_values(ascending=False).head(10)
    top_product_descriptions = top_products.index.tolist()

    # Forecast for each top product
    for product_desc in top_product_descriptions:
        product_data = data[data['item_description'] == product_desc]
        product_data = product_data.sort_values('purchase_date')
        sales_values = product_data[['price']].values

        # Prepare data for forecasting
        scaler = MinMaxScaler()
        scaled_data = scaler.fit_transform(sales_values)

        # Create sequences
        SEQ_LENGTH = 30
        X = []
        for i in range(len(scaled_data) - SEQ_LENGTH):
            X.append(scaled_data[i:i+SEQ_LENGTH])
        X = np.array(X)

        # Forecast future sales (next 7 days)
        last_sequence = scaled_data[-SEQ_LENGTH:].reshape(1, SEQ_LENGTH, 1)
        future_forecast = []
        for _ in range(7):
            pred = lstm_model.predict(last_sequence)
            future_forecast.append(pred[0][0])
            last_sequence = np.append(last_sequence[:, 1:, :], [[pred]], axis=1)
        future_forecast = scaler.inverse_transform(np.array(future_forecast).reshape(-1, 1)).flatten().tolist()

        # Collect results
        report_data["top_products_forecasting"].append({
            "product_description": product_desc,
            "forecast": future_forecast
        })

    # Generate Top 10 locations by sales amount
    top_locations = data.groupby('location')['price'].sum().sort_values(ascending=False).head(10)
    report_data["top_locations"] = top_locations.reset_index().to_dict(orient='records')

    # Generate Top 10 categories by sales amount
    top_categories = data.groupby('master_category_full_name')['price'].sum().sort_values(ascending=False).head(10)
    top_category_names = top_categories.index.tolist()

    # Forecast for each top category
    for category_name in top_category_names:
        category_data = data[data['master_category_full_name'] == category_name]
        category_data = category_data.sort_values('purchase_date')
        sales_values = category_data[['price']].values

        # Prepare data for forecasting
        scaler = MinMaxScaler()
        scaled_data = scaler.fit_transform(sales_values)

        # Create sequences
        SEQ_LENGTH = 30
        X = []
        for i in range(len(scaled_data) - SEQ_LENGTH):
            X.append(scaled_data[i:i+SEQ_LENGTH])
        X = np.array(X)

        # Forecast future sales (next 7 days)
        last_sequence = scaled_data[-SEQ_LENGTH:].reshape(1, SEQ_LENGTH, 1)
        future_forecast = []
        for _ in range(7):
            pred = lstm_model.predict(last_sequence)
            future_forecast.append(pred[0][0])
            last_sequence = np.append(last_sequence[:, 1:, :], [[pred]], axis=1)
        future_forecast = scaler.inverse_transform(np.array(future_forecast).reshape(-1, 1)).flatten().tolist()

        # Collect results
        report_data["top_categories_forecasting"].append({
            "category_name": category_name,
            "forecast": future_forecast
        })

    return report_data

def get_top_100_products():
    # Calculate total sales for each product
    product_sales = data.groupby('item_description')['price'].sum().sort_values(ascending=False).head(100)
    top_products = product_sales.reset_index().to_dict(orient='records')
    return top_products