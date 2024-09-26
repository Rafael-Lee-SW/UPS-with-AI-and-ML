# data_preparation.py

import pandas as pd
import numpy as np

# Load the CSV file
file_path = r'C:\Users\SSAFY\Desktop\data_ML\purchase_transactions_2022_2023.csv'
print("Loading data...")

data = pd.read_csv(file_path, parse_dates=['purchase_date'])

# Print to confirm the data is loaded correctly
print("Data loaded. Columns are:")
print(data.columns)

# Remove missing values
data.dropna(inplace=True)

# Assign random locations (1-100) to each product
np.random.seed(42)
product_ids = data['product_code'].unique()
location_mapping = {pid: np.random.randint(1, 101) for pid in product_ids}
data['location'] = data['product_code'].map(location_mapping)

# Ensure the 'purchase_date' column is included and set as index
data = data.sort_values('purchase_date')
data.set_index('purchase_date', inplace=False)  # Keep 'purchase_date' column, don't set as index

# Extract necessary columns (including purchase_date)
data = data[['purchase_date', 'product_code', 'item_description', 'master_category_full_name', 'price', 'sales_unit', 'location']]

# Check the first few rows to ensure the data is correct
print("Processed data preview:")
print(data.head())

# Save the prepared data (with 'purchase_date' column)
output_file = 'prepared_sales_data.csv'
data.to_csv(output_file, index=False)

# Confirm that the file was saved successfully
print(f"Data has been saved to {output_file}")
