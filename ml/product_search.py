import pandas as pd
import numpy as np
import tensorflow as tf
from sklearn.preprocessing import MinMaxScaler


def search_and_forecast(product_code):
    # Load data and model
    data = pd.read_csv(
        "prepared_sales_data.csv",
        parse_dates=["purchase_date"],
        dtype={"product_code": str},
    )
    lstm_model = tf.keras.models.load_model("lstm_sales_forecast_model.h5")

    # Convert product_code to string without decimal if necessary
    data["product_code"] = data["product_code"].apply(lambda x: str(int(float(x))))

    # Convert the input product_code to the same format
    product_code = str(int(float(product_code)))

    # Debugging: Print the queried product code and the dataset's product codes
    print(f"Searching for product code: {product_code}")
    print(f"Available product codes: {data['product_code'].unique()}")

    # Filter for the matching product
    product_data = data[data["product_code"] == product_code]

    if product_data.empty:
        return None

    product_desc = product_data["item_description"].iloc[0]
    product_data = product_data.sort_values("purchase_date")
    sales_values = product_data[["price"]].values

    # Prepare data for forecasting
    scaler = MinMaxScaler()
    scaled_data = scaler.fit_transform(sales_values)

    # Create sequences
    SEQ_LENGTH = 30
    X = []
    for i in range(len(scaled_data) - SEQ_LENGTH):
        X.append(scaled_data[i : i + SEQ_LENGTH])
    X = np.array(X)

    # Check if there is enough data
    if len(X) == 0:
        return {
            "product_code": product_code,
            "product_description": product_desc,
            "forecast": [],
            "message": "Not enough data to generate forecast.",
        }

    # Forecast future sales (next 7 days)
    last_sequence = scaled_data[-SEQ_LENGTH:].reshape(1, SEQ_LENGTH, 1)
    future_forecast = []
    for _ in range(7):
        pred = lstm_model.predict(last_sequence)
        future_forecast.append(pred[0][0])
        last_sequence = np.concatenate(
            [last_sequence[:, 1:, :], pred.reshape(1, 1, 1)], axis=1
        )

    future_forecast = (
        scaler.inverse_transform(np.array(future_forecast).reshape(-1, 1))
        .flatten()
        .tolist()
    )

    # Prepare the result
    result = {
        "product_code": product_code,
        "product_description": product_desc,
        "forecast": future_forecast,
    }
    return result
