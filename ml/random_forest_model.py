# random_forest_model.py

import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error
from sklearn.preprocessing import LabelEncoder
import joblib

# Load prepared data and locations
data = pd.read_csv('prepared_sales_data.csv', parse_dates=['purchase_date'])
locations = pd.read_csv('locations.csv')

# Merge location data
data = data.merge(locations[['id', 'xPosition', 'yPosition']], left_on='location_id', right_on='id', how='left')

# Encode categorical variables
label_encoder_product = LabelEncoder()
data['product_code_encoded'] = label_encoder_product.fit_transform(data['product_code'])

label_encoder_category = LabelEncoder()
data['category_encoded'] = label_encoder_category.fit_transform(data['master_category_full_name'])

# Features and target
features = ['product_code_encoded', 'category_encoded', 'xPosition', 'yPosition']
target = 'price'

# Prepare data
X = data[features]
y = data[target]

# Split into train and test sets
split = int(0.8 * len(X))
X_train, X_test = X.iloc[:split], X.iloc[split:]
y_train, y_test = y.iloc[:split], y.iloc[split:]

# Build Random Forest model
rf_model = RandomForestRegressor(n_estimators=100, random_state=42)
rf_model.fit(X_train, y_train)

# Save the trained Random Forest model and encoders
joblib.dump(rf_model, 'random_forest_sales_model.pkl')
joblib.dump(label_encoder_product, 'label_encoder_product.pkl')
joblib.dump(label_encoder_category, 'label_encoder_category.pkl')

# Evaluate the model
y_pred = rf_model.predict(X_test)
mse = mean_squared_error(y_test, y_pred)
rmse = np.sqrt(mse)
mean_actual = np.mean(y_test)
accuracy = 100 - (rmse / mean_actual) * 100

print(f"Random Forest Model MSE: {mse}")
print(f"Random Forest Model Accuracy: {accuracy:.2f}%")
