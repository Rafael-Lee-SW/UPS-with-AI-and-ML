import pandas as pd
import numpy as np
import tensorflow as tf
from sklearn.preprocessing import MinMaxScaler
import matplotlib.pyplot as plt

# Load data and model
data = pd.read_csv('prepared_sales_data.csv', parse_dates=['purchase_date'])
lstm_model = tf.keras.models.load_model('lstm_sales_forecast_model.h5')

def search_and_forecast(product_name):
    product_data = data[data['item_description'].str.contains(product_name, case=False)]
    if product_data.empty:
        print("Product not found.")
        return
    product_desc = product_data['item_description'].iloc[0]
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

    # Forecast future sales
    last_sequence = scaled_data[-SEQ_LENGTH:].reshape(1, SEQ_LENGTH, 1)
    future_forecast = []
    for _ in range(30):  # Forecast next 30 days
        pred = lstm_model.predict(last_sequence)
        future_forecast.append(pred[0][0])
        last_sequence = np.append(last_sequence[:, 1:, :], [[pred]], axis=1)
    future_forecast = scaler.inverse_transform(np.array(future_forecast).reshape(-1, 1))

    # Plot forecast
    plt.figure(figsize=(10, 6))
    plt.plot(future_forecast)
    plt.title(f'30-Day Forecasting of Sales Amount for {product_desc}')
    plt.xlabel('Time Step')
    plt.ylabel('Sales Amount')
    plt.show()

    # Print summary
    print(f"Forecasted Sales Amount for {product_desc}:")
    print(future_forecast.flatten())

# Example usage
product_name = input("Enter product name to search: ")
search_and_forecast(product_name)
