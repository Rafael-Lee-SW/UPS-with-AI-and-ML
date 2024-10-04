# ml.py
# Import necessary libraries
import pandas as pd
import matplotlib.pyplot as plt
from statsmodels.tsa.arima.model import ARIMA
from fpdf import FPDF
import warnings
warnings.filterwarnings("ignore")  # Ignore warnings for cleaner output

# Load the CSV file
file_path = r'C:\Users\SSAFY\Desktop\data_ML\purchase_transactions_2022_2023.csv'
data = pd.read_csv(file_path, parse_dates=['purchase_date'])

# Fill missing values if necessary
data['price'] = data['price'].fillna(data['price'].mean())
data['sales_unit'] = data['sales_unit'].fillna(data['sales_unit'].mean())

# Calculate total sales amount per transaction
data['total_sales'] = data['price'] * data['sales_unit']

# Chapter 1: Analyze the Top 100 Selling Products

# Aggregate total sales per product
product_sales = data.groupby('product_code')['total_sales'].sum().reset_index()

# Select the top 100 selling products
top_100_products = product_sales.sort_values(by='total_sales', ascending=False).head(100)
top_100_product_codes = top_100_products['product_code'].tolist()

# Initialize PDF Report
pdf = FPDF()
pdf.set_auto_page_break(auto=True, margin=15)

# Add first page for summary
pdf.add_page()
pdf.set_font("Arial", 'B', 16)
pdf.cell(200, 10, txt="Top 100 Products Sales Analysis Report", ln=True, align='C')

# Forecast sales for the top 100 products and generate insights
forecast_horizon = 30  # Forecast for 30 days
valid_forecasts = 0

for product in top_100_product_codes:
    product_data = data[data['product_code'] == product]
    product_time_series = product_data.set_index('purchase_date').resample('D')['total_sales'].sum()

    # Only proceed if enough data points are available
    if len(product_time_series.dropna()) >= 30:
        # Fit ARIMA model and forecast
        model = ARIMA(product_time_series, order=(1, 1, 1))
        model_fit = model.fit()

        # Forecast future sales
        forecast = model_fit.forecast(steps=forecast_horizon)

        # Plot the forecast and historical data
        plt.figure(figsize=(10, 5))
        plt.plot(product_time_series.index, product_time_series.values, label='Historical Sales')
        plt.plot(forecast.index, forecast.values, label='Forecasted Sales', color='red')
        plt.title(f"Sales Forecast for Product {product}")
        plt.xlabel('Date')
        plt.ylabel('Total Sales')
        plt.legend()
        plt.grid(True)

        # Save the plot
        plt.tight_layout()
        plt.savefig(f'forecast_{product}.png')
        plt.close()

        # Add the forecast data and image to the PDF
        pdf.set_font("Arial", size=12)
        pdf.cell(200, 10, txt=f"Product {product} Sales Forecast:", ln=True)
        pdf.image(f'forecast_{product}.png', x=10, y=None, w=180)
        valid_forecasts += 1

        # Break after 5 products for simplicity in this example
        if valid_forecasts >= 5:
            break

# Chapter 2: Sales by Age Group and Gender

# Sales by Age Group
age_group_sales = data.groupby('age_group')['total_sales'].sum().reset_index()

# Plot Sales by Age Group
plt.figure(figsize=(8, 6))
plt.bar(age_group_sales['age_group'].astype(str), age_group_sales['total_sales'])
plt.xlabel('Age Group')
plt.ylabel('Total Sales')
plt.title('Sales by Age Group')
plt.grid(True)
plt.tight_layout()
plt.savefig('sales_by_age_group.png')
plt.close()

# Add Age Group Sales Graph to PDF
pdf.add_page()
pdf.set_font("Arial", 'B', 14)
pdf.cell(200, 10, txt="Sales by Age Group", ln=True)
pdf.image('sales_by_age_group.png', x=10, y=None, w=180)

# Sales by Gender
gender_sales = data.groupby('person_gender')['total_sales'].sum().reset_index()
gender_mapping = {0: 'Female', 1: 'Male', -1: 'Unknown'}
gender_sales['person_gender'] = gender_sales['person_gender'].map(gender_mapping)

# Plot Sales by Gender
plt.figure(figsize=(6, 6))
plt.pie(gender_sales['total_sales'], labels=gender_sales['person_gender'], autopct='%1.1f%%', startangle=90)
plt.title('Sales by Gender')
plt.tight_layout()
plt.savefig('sales_by_gender.png')
plt.close()

# Add Gender Sales Graph to PDF
pdf.add_page()
pdf.set_font("Arial", 'B', 14)
pdf.cell(200, 10, txt="Sales by Gender", ln=True)
pdf.image('sales_by_gender.png', x=10, y=None, w=180)

# Save the PDF Report
pdf.output("sales_analysis_report.pdf")

print(f"Report generated with {valid_forecasts} forecasts and saved as 'sales_analysis_report.pdf'.")
