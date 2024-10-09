import pandas as pd
import numpy as np
import string
import random
from datetime import datetime, timedelta

# Load the CSV file
file_path = r'C:\Users\ale78\OneDrive\바탕 화면\data_ML\purchase_transactions_2022_2023.csv'
# file_path = r'C:\Users\SSAFY\desktop\data_ML\purchase_transactions_2022_2023.csv' // in SSAFY
print("Loading data...")

data = pd.read_csv(file_path, parse_dates=['purchase_date'])

# Remove missing values
data.dropna(inplace=True)

# Generate 10 random locations
def generate_random_name(length=10):
    letters = string.ascii_letters
    return ''.join(random.choice(letters) for i in range(length))

locations = []
for i in range(10):
    location = {
        'id': i,
        'name': generate_random_name(),
        'xPosition': np.random.randint(0, 1001),
        'yPosition': np.random.randint(0, 1001),
        'xSize': np.random.randint(10, 101),
        'ySize': np.random.randint(10, 101),
        'zSize': np.random.randint(1, 6),
        'rotation': 0,
        'touchableFloor': 0
    }
    if i == 0:
        location['touchableFloor'] = 1  # Entrance
    elif i == 1:
        location['touchableFloor'] = 2  # Exit
    locations.append(location)

# Create a DataFrame for locations
locations_df = pd.DataFrame(locations)

# Assign random location ids (from 2 to 9) to products
product_ids = data['product_code'].unique()
location_ids = np.random.randint(2, 10, size=len(product_ids))
location_mapping = dict(zip(product_ids, location_ids))
data['location_id'] = data['product_code'].map(location_mapping)

# Prepare the final data
data = data[['id', 'person_id', 'purchase_date', 'retailer', 'item_description', 'product_code',
             'master_category_full_name', 'price', 'sales_unit', 'age_group', 'person_gender', 'location_id']]

# Save the prepared data and locations
data_output_file = 'prepared_sales_data.csv'
locations_output_file = 'locations.csv'
data.to_csv(data_output_file, index=False)
locations_df.to_csv(locations_output_file, index=False)

print(f"Data has been saved to {data_output_file}")
print(f"Locations have been saved to {locations_output_file}")

# Filter to the last 45 days
today = data['purchase_date'].max()
one_month_ago = today - timedelta(days=45)
data_last_month = data[data['purchase_date'] >= one_month_ago].copy()

# Save the filtered data
data_last_month_output_file = 'prepared_sales_data_last_month.csv'
data_last_month.to_csv(data_last_month_output_file, index=False)
print(f"Data for the last 45 days has been saved to {data_last_month_output_file}")

# Extract unique products and aggregate data
products = data.groupby(['product_code', 'item_description']).agg({
    'price': 'mean',  # Average price if prices vary
    'sales_unit': 'sum'  # Total units sold
}).reset_index()

# Calculate selling_price (unit price)
products['selling_price'] = products['price'] / products['sales_unit']

# Ensure original_price is not below 100 and calculate it
products['original_price'] = products['selling_price'] - 500
products['original_price'] = products['original_price'].apply(lambda x: max(x, 100))

# Fill in other required fields
products['quantity'] = 100
products['barcode'] = products['product_code']
products['created_date'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
products['floor_id'] = 6
products['id'] = 15  # If you need unique IDs, you can generate them
products['store_id'] = 25
products['updated_date'] = ''  # Or set to current date/time if needed
products['product_name'] = products['item_description']
products['sku'] = None

# Select the required columns
product_columns = [
    'original_price', 'quantity', 'selling_price', 'barcode', 'created_date',
    'floor_id', 'id', 'store_id', 'updated_date', 'product_name', 'sku'
]
product_df = products[product_columns]

# Ensure that barcodes are unique
product_df = product_df.drop_duplicates(subset=['barcode'])

# Save to CSV
product_output_file = 'product_data.csv'
product_df.to_csv(product_output_file, index=False)
print(f"Product data has been saved to {product_output_file}")

# Extract top 100 products by total sales amount for the last 45 days
data_last_month_aggregated = data_last_month.groupby(['product_code', 'item_description']).agg({
    'price': 'sum',  # Total sales amount
    'sales_unit': 'sum'  # Total units sold
}).reset_index()

# Sort by total sales amount and calculate sales price
data_last_month_aggregated['total_sales_amount'] = data_last_month_aggregated['price']
data_last_month_aggregated['selling_price'] = data_last_month_aggregated['price'] / data_last_month_aggregated['sales_unit']

# Ensure original price is calculated correctly for last 45 days and not below 100
data_last_month_aggregated['original_price'] = data_last_month_aggregated['selling_price'] - 500
data_last_month_aggregated['original_price'] = data_last_month_aggregated['original_price'].apply(lambda x: max(x, 100))

# Sort by total sales amount in descending order
top_100_products_last_month = data_last_month_aggregated.sort_values(by='total_sales_amount', ascending=False).head(100)

# Add additional information
top_100_products_last_month['quantity'] = 100
top_100_products_last_month['created_date'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
top_100_products_last_month['store_id'] = 25
top_100_products_last_month['updated_date'] = ''
top_100_products_last_month['product_name'] = top_100_products_last_month['item_description']
top_100_products_last_month['sku'] = None

# Select required columns
top_100_columns = [
    'product_code', 'product_name', 'sales_unit', 'original_price', 'selling_price', 'total_sales_amount',
    'quantity', 'created_date', 'store_id', 'updated_date', 'sku'
]
top_100_df = top_100_products_last_month[top_100_columns]

# Save the top 100 product list for the last 45 days
top_100_output_file = 'top_100_product_list_last45.csv'
top_100_df.to_csv(top_100_output_file, index=False)
print(f"Top 100 products list for the last 45 days has been saved to {top_100_output_file}")
