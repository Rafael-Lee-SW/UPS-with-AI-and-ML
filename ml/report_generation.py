import pandas as pd
import numpy as np
import tensorflow as tf  # TensorFlow import
from sklearn.preprocessing import MinMaxScaler  # MinMaxScaler import
from sklearn.metrics import mean_squared_error
import matplotlib.pyplot as plt
import matplotlib.font_manager as fm
from datetime import datetime, timedelta
import re

# Set Korean font for matplotlib
plt.rcParams['font.family'] = 'Malgun Gothic'
plt.rcParams['axes.unicode_minus'] = False  # To handle minus signs correctly

# Function to sanitize file names by replacing invalid characters
def sanitize_filename(filename):
    return re.sub(r'[<>:"/\\|?* ]', '_', filename)

# Load data and models
data = pd.read_csv('prepared_sales_data.csv', parse_dates=['purchase_date'])
lstm_model = tf.keras.models.load_model('lstm_sales_forecast_model.h5')  # Load LSTM model

# Generate Top 10 products by sales amount
top_products = data.groupby('item_description')['price'].sum().sort_values(ascending=False).head(10)
top_product_descriptions = top_products.index.tolist()

# Generate Top 10 locations by sales amount
top_locations = data.groupby('location')['price'].sum().sort_values(ascending=False).head(10)

# Generate Top 10 categories by sales amount
top_categories = data.groupby('master_category_full_name')['price'].sum().sort_values(ascending=False).head(10)
top_category_names = top_categories.index.tolist()

# Generate forecasts for each top product
report_date = datetime.now().strftime('%Y-%m-%d')

with open('sales_report.md', 'w', encoding='utf-8') as f:
    f.write("# Result of Analyzing and Forecasting of Your Products\n\n")

    # Top 10 Product Forecasting Section
    f.write("## Top 10 Sales Amount Product Forecasting\n\n")
    for idx, product_desc in enumerate(top_product_descriptions, 1):
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

        # Forecast future sales (next 7 days, 4 weeks, 12 months)
        forecasts = {}
        periods = {'Week': 7, 'Month': 30, 'Year': 365}
        for period_name, period_length in periods.items():
            last_sequence = scaled_data[-SEQ_LENGTH:].reshape(1, SEQ_LENGTH, 1)
            future_forecast = []
            for _ in range(period_length):
                pred = lstm_model.predict(last_sequence)
                pred_reshaped = pred.reshape((1, 1, 1))  # Reshape pred to (1, 1, 1) to match the dimensions
                future_forecast.append(pred[0][0])
                last_sequence = np.append(last_sequence[:, 1:, :], pred_reshaped, axis=1)  # Append reshaped prediction

            # Check for any NaN or infinite values before inverse transform
            future_forecast = np.array(future_forecast).reshape(-1, 1)
            if np.any(np.isnan(future_forecast)) or np.any(np.isinf(future_forecast)):
                print(f"Warning: {period_name} forecast for {product_desc} contains NaN or Infinity values.")
                continue  # Skip this forecast if invalid values are detected

            # Perform inverse transform
            future_forecast = scaler.inverse_transform(future_forecast)
            forecasts[period_name] = future_forecast

        # Write to report and calculate MSE and accuracy
        f.write(f"#### Top {idx}: {product_desc}\n")
        f.write("Sales Amount (Unit: Korean Won)\n\n")

        for period_name in periods.keys():
            if period_name in forecasts:
                # Compare only up to the length of the forecast or actual values
                actual_values = sales_values[-len(forecasts[period_name]):]  # Trim actual values to match forecast length
                if len(actual_values) != len(forecasts[period_name]):
                    # If the actual data is shorter, trim the forecast to match the available actual values
                    print(f"Warning: Actual values and forecast lengths differ for {product_desc} in {period_name}.")
                    forecast_trimmed = forecasts[period_name][:len(actual_values)]
                    mse = mean_squared_error(actual_values, forecast_trimmed)
                else:
                    mse = mean_squared_error(actual_values, forecasts[period_name])
                
                accuracy = 100 - (np.sqrt(mse) / np.mean(actual_values)) * 100

                f.write(f"**{period_name} Accuracy**: {accuracy:.2f}% (MSE: {mse:.2f})\n")

                # Plot forecast with decorated axis
                last_date = product_data.index[-1]
                
                # Ensure last_date is a datetime object, and create forecast_dates
                if isinstance(last_date, pd.Timestamp):
                    forecast_dates = [last_date + timedelta(days=i) for i in range(1, periods[period_name] + 1)]
                else:
                    # Fallback: Use 'purchase_date' column to get the last date
                    last_date = product_data['purchase_date'].max()
                    forecast_dates = [last_date + timedelta(days=i) for i in range(1, periods[period_name] + 1)]

                plt.figure(figsize=(10, 6))
                plt.plot(forecast_dates, forecasts[period_name], label='Predicted Sales', color='blue')
                plt.title(f'{period_name} Forecasting of Sales Amount for {product_desc}')
                plt.xlabel('Date')
                plt.ylabel('Sales Amount (Korean Won)')
                plt.xticks(rotation=45)
                plt.grid(True)
                plt.legend()
                plt.tight_layout()

                # Sanitize product description for filename
                sanitized_product_desc = sanitize_filename(product_desc)

                # Save and write graph to report
                plt.savefig(f'{sanitized_product_desc}_{period_name}_forecast.png')
                plt.close()
                f.write(f"![{period_name} Forecast](./{sanitized_product_desc}_{period_name}_forecast.png)\n\n")

    # Popular Locations Section
    f.write("## Top 10 Popular Locations by Sales\n\n")
    f.write("The following graph shows the top 10 locations with the highest sales.\n\n")
    plt.figure(figsize=(10, 6))
    top_locations.plot(kind='bar', color='green')
    plt.title('Top 10 Popular Locations by Sales')
    plt.ylabel('Total Sales (Korean Won)')
    plt.xticks(rotation=45)
    plt.grid(True)
    plt.tight_layout()
    plt.savefig('top_locations_sales.png')
    plt.close()
    f.write("![Top Locations by Sales](./top_locations_sales.png)\n\n")

    # Category Forecasting Section
    f.write("## Top 10 Sales Categories Forecasting\n\n")
    for idx, category_name in enumerate(top_category_names, 1):
        category_data = data[data['master_category_full_name'] == category_name]
        category_data = category_data.sort_values('purchase_date')
        sales_values = category_data[['price']].values

        # Prepare data for forecasting
        scaler = MinMaxScaler()
        scaled_data = scaler.fit_transform(sales_values)

        # Create sequences
        X = []
        for i in range(len(scaled_data) - SEQ_LENGTH):
            X.append(scaled_data[i:i+SEQ_LENGTH])
        X = np.array(X)

        # Forecast future sales (next 7 days, 4 weeks, 12 months)
        forecasts = {}
        for period_name, period_length in periods.items():
            last_sequence = scaled_data[-SEQ_LENGTH:].reshape(1, SEQ_LENGTH, 1)
            future_forecast = []
            for _ in range(period_length):
                pred = lstm_model.predict(last_sequence)
                pred_reshaped = pred.reshape((1, 1, 1))  # Reshape pred to (1, 1, 1)
                future_forecast.append(pred[0][0])
                last_sequence = np.append(last_sequence[:, 1:, :], pred_reshaped, axis=1)

            future_forecast = np.array(future_forecast).reshape(-1, 1)
            if np.any(np.isnan(future_forecast)) or np.any(np.isinf(future_forecast)):
                print(f"Warning: {period_name} forecast for {category_name} contains NaN or Infinity values.")
                continue

            future_forecast = scaler.inverse_transform(future_forecast)
            forecasts[period_name] = future_forecast

        # Write to report
        f.write(f"#### Top {idx}: {category_name}\n")
        f.write("Sales Amount (Unit: Korean Won)\n\n")
        for period_name in periods.keys():
            if period_name in forecasts:
                last_date = category_data.index[-1]
                
                # Ensure last_date is a datetime object, and create forecast_dates
                if isinstance(last_date, pd.Timestamp):
                    forecast_dates = [last_date + timedelta(days=i) for i in range(1, periods[period_name] + 1)]
                else:
                    # Fallback: Use 'purchase_date' column to get the last date
                    last_date = category_data['purchase_date'].max()
                    forecast_dates = [last_date + timedelta(days=i) for i in range(1, periods[period_name] + 1)]

                plt.figure(figsize=(10, 6))
                plt.plot(forecast_dates, forecasts[period_name], label='Predicted Sales', color='blue')
                plt.title(f'{period_name} Forecasting of Sales Amount for {category_name}')
                plt.xlabel('Date')
                plt.ylabel('Sales Amount (Korean Won)')
                plt.xticks(rotation=45)
                plt.grid(True)
                plt.legend()
                plt.tight_layout()

                # Sanitize category name for filename
                sanitized_category_name = sanitize_filename(category_name)

                # Save and write graph to report
                plt.savefig(f'{sanitized_category_name}_{period_name}_forecast.png')
                plt.close()
                f.write(f"![{period_name} Forecast](./{sanitized_category_name}_{period_name}_forecast.png)\n\n")


    f.write(f"##### Report Date: {report_date}\n")
