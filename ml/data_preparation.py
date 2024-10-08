# data_preparation.py

import pandas as pd
import numpy as np
import string
import random
from datetime import datetime, timedelta

# Load the CSV file
file_path = r'C:\Users\SSAFY\Desktop\data_ML\purchase_transactions_2022_2023.csv'
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

# Filter to the last month
today = data['purchase_date'].max()
one_month_ago = today - timedelta(days=90)
data_last_month = data[data['purchase_date'] >= one_month_ago].copy()

# Save the filtered data
data_last_month_output_file = 'prepared_sales_data_last_month.csv'
data_last_month.to_csv(data_last_month_output_file, index=False)
print(f"Data for the last month has been saved to {data_last_month_output_file}")

# 재생산된 호출 모음

# Extract unique products and aggregate data
products = data.groupby(['product_code', 'item_description']).agg({
    'price': 'mean',  # Assuming you want the average price if prices vary
    'sales_unit': 'sum'  # Total units sold
}).reset_index()

# Calculate selling_price (unit price)
products['selling_price'] = products['price'] / products['sales_unit']

# Fill in other required fields
products['original_price'] = products['selling_price'] - 500
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