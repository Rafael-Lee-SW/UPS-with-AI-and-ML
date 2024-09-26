# lstm_model.py

import pandas as pd
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import mean_squared_error

# Load prepared data
data = pd.read_csv('prepared_sales_data.csv', parse_dates=['purchase_date'])

# Function to prepare data for a specific product
def prepare_product_data(product_code, data, target_column, seq_length):
    product_data = data[data['product_code'] == product_code].copy()
    product_data.sort_values('purchase_date', inplace=True)
    sales_values = product_data[[target_column]].values

    # Scale data
    scaler = MinMaxScaler()
    scaled_data = scaler.fit_transform(sales_values)

    # Create sequences
    X, y = [], []
    for i in range(len(scaled_data) - seq_length):
        X.append(scaled_data[i:i+seq_length])
        y.append(scaled_data[i+seq_length])
    X, y = np.array(X), np.array(y)

    # Split into train and test sets
    split = int(0.8 * len(X))
    X_train, X_test = X[:split], X[split:]
    y_train, y_test = y[:split], y[split:]

    return X_train, X_test, y_train, y_test, scaler

# Parameters
SEQ_LENGTH = 30
TARGET_COLUMN = 'price'  # Change to 'sales_unit' for units prediction

# Get unique product codes
product_codes = data['product_code'].unique()

# We'll demonstrate with the top-selling product
top_product_code = data.groupby('product_code')['price'].sum().idxmax()

# Prepare data for the top product
X_train, X_test, y_train, y_test, scaler = prepare_product_data(top_product_code, data, TARGET_COLUMN, SEQ_LENGTH)

# Build LSTM model
model = Sequential()
model.add(LSTM(units=50, activation='relu', input_shape=(SEQ_LENGTH, 1)))
model.add(Dense(units=1))
model.compile(optimizer='adam', loss='mean_squared_error')

# Train the model
history = model.fit(
    X_train, y_train,
    epochs=20,
    batch_size=32,
    validation_data=(X_test, y_test)
)

# Evaluate the model
y_pred = model.predict(X_test)
y_test_inv = scaler.inverse_transform(y_test)
y_pred_inv = scaler.inverse_transform(y_pred)

mse = mean_squared_error(y_test_inv, y_pred_inv)
print(f"LSTM Model MSE: {mse}")

# Save the model
model.save('lstm_sales_forecast_model.h5')
