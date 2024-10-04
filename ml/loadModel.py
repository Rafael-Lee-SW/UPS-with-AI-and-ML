# loadModel.py
import numpy as np
import pandas as pd
import tensorflow as tf
from sklearn.preprocessing import MinMaxScaler

# Load the trained model
model = tf.keras.models.load_model('sales_forecast_model.h5')

# Example: Test the model with some new data (make sure to preprocess it similarly to your training data)
# For example, let's assume you're testing with a similar structure of 30 days of data.
# You can generate synthetic test data, or load real data from your dataset.

# Load new data (same structure as training data)
file_path = r'C:\Users\SSAFY\Desktop\data_ML\purchase_transactions_2022_2023.csv'
data = pd.read_csv(file_path, parse_dates=['purchase_date'])

# Data preprocessing
data.dropna(inplace=True)
data = data.sort_values('purchase_date')
data.set_index('purchase_date', inplace=True)

# Assume 'price' is the target column
scaler = MinMaxScaler()
sales_data = data[['price']].values
scaled_data = scaler.fit_transform(sales_data)

# Let's create sequences from the test data (like you did during training)
SEQ_LENGTH = 30
def create_sequences(data, seq_length):
    xs = []
    for i in range(len(data) - seq_length):
        x = data[i:(i + seq_length)]
        xs.append(x)
    return np.array(xs)

X_test_new = create_sequences(scaled_data, SEQ_LENGTH)

# Make predictions using the loaded model
y_pred_new = model.predict(X_test_new)

# Inverse transform the predictions to get actual prices
y_pred_new_inv = scaler.inverse_transform(y_pred_new)

# Print or plot the predictions
print("Predicted Sales:")
print(y_pred_new_inv[:10])  # Print the first 10 predictions

# Visualize
import matplotlib.pyplot as plt
plt.plot(y_pred_new_inv[:100])  # Plot the first 100 predictions
plt.title('Predicted Sales')
plt.xlabel('Time Step')
plt.ylabel('Sales')
plt.show()
