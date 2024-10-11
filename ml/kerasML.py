import pandas as pd
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense
from sklearn.preprocessing import MinMaxScaler
import matplotlib.pyplot as plt

# 데이터 로드 및 전처리
file_path = r'C:\Users\SSAFY\Desktop\data_ML\purchase_transactions_2022_2023.csv'
data = pd.read_csv(file_path, parse_dates=['purchase_date'])

# 결측치 제거
data.dropna(inplace=True)

# 날짜로 정렬 및 인덱스로 설정
data = data.sort_values('purchase_date')
data.set_index('purchase_date', inplace=True)

# 열 이름 확인
print(data.columns)

# 'price' 또는 'sales_unit' 열을 사용하여 예측
# 여기서는 'price'를 예시로 사용
sales_data = data[['price']].values  # 또는 'sales_unit'를 사용할 수 있습니다.

# 데이터 스케일링
scaler = MinMaxScaler()
scaled_data = scaler.fit_transform(sales_data)

# 시퀀스 생성
SEQ_LENGTH = 30

def create_sequences(data, seq_length):
    xs = []
    ys = []
    for i in range(len(data) - seq_length):
        x = data[i:(i + seq_length)]
        y = data[i + seq_length]
        xs.append(x)
        ys.append(y)
    return np.array(xs), np.array(ys)

X, y = create_sequences(scaled_data, SEQ_LENGTH)

# 데이터 분할
split = int(0.8 * len(X))
X_train, X_test = X[:split], X[split:]
y_train, y_test = y[:split], y[split:]

# 모델 구축
model = Sequential()
model.add(LSTM(units=50, activation='relu', input_shape=(X_train.shape[1], X_train.shape[2])))
model.add(Dense(units=1))
model.compile(optimizer='adam', loss='mean_squared_error')

# 모델 학습
history = model.fit(
    X_train, y_train,
    epochs=50,
    batch_size=32,
    validation_data=(X_test, y_test)
)

# 모델 평가
y_pred = model.predict(X_test)
y_test_inv = scaler.inverse_transform(y_test)
y_pred_inv = scaler.inverse_transform(y_pred)

plt.figure(figsize=(10,6))
plt.plot(y_test_inv, label='Actual')
plt.plot(y_pred_inv, label='Predicted')
plt.title('Actual vs Predicted Sales')
plt.xlabel('Time')
plt.ylabel('Sales')
plt.legend()
plt.show()

# 모델 저장
model.save('sales_forecast_model.h5')
