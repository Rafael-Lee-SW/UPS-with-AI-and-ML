import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error
from sklearn.preprocessing import LabelEncoder
import joblib

# Load prepared data
print("Loading data...")
data = pd.read_csv('prepared_sales_data.csv', parse_dates=['purchase_date'])

# Print column names to confirm data loaded correctly
print("Data loaded successfully. Columns are:")
print(data.columns)

# Encode categorical variables
label_encoder = LabelEncoder()
data['product_code_encoded'] = label_encoder.fit_transform(data['product_code'])
data['category_encoded'] = label_encoder.fit_transform(data['master_category_full_name'])

# Features and target
features = ['product_code_encoded', 'category_encoded', 'location']
target = 'price'  # You can change this to 'sales_unit' if needed

# Print features and target details
print(f"Features: {features}, Target: {target}")

# Prepare data
X = data[features]
y = data[target]

# Split into train and test sets
split = int(0.8 * len(X))
X_train, X_test = X.iloc[:split], X.iloc[split:]
y_train, y_test = y.iloc[:split], y.iloc[split:]

# Print the shape of the training and test sets
print(f"Training data shape: {X_train.shape}, Testing data shape: {X_test.shape}")

# Build Random Forest model
print("Training the Random Forest model...")
rf_model = RandomForestRegressor(n_estimators=100, random_state=42)
rf_model.fit(X_train, y_train)

# Save the trained Random Forest model
joblib.dump(rf_model, 'random_forest_sales_model.pkl')
print("Model saved as 'random_forest_sales_model.pkl'")

# Evaluate the model
print("Evaluating the model...")
y_pred = rf_model.predict(X_test)
mse = mean_squared_error(y_test, y_pred)

# Print the MSE to see the result
print(f"Random Forest Model MSE: {mse}")

# Save the predictions and actual values to a CSV file
predictions_df = pd.DataFrame({
    'Actual': y_test,
    'Predicted': y_pred
})
predictions_df.to_csv('random_forest_predictions.csv', index=False)
print("Predictions saved to 'random_forest_predictions.csv'")
