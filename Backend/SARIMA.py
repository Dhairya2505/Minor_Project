import pandas as pd
import numpy as np
from statsmodels.tsa.statespace.sarimax import SARIMAX
from statsmodels.tsa.stattools import adfuller
from sklearn.metrics import mean_squared_error
import matplotlib.pyplot as plt
import io
import base64

def create_chart(data, forecasted, x, y, title):
    
    plt.figure()
    plt.plot(forecasted, label='Forecated values')
    plt.plot(data, label='Actual values')
    plt.xlabel(x)
    plt.ylabel(y)
    plt.legend()
    plt.title(title)

    img = io.BytesIO()
    plt.savefig(img, format='png')
    img.seek(0)

    img_base64 = base64.b64encode(img.getvalue()).decode('utf-8')

    return img_base64

def adf_test(series):
    result = adfuller(series)
    if result[1] <= 0.05:
        return True
    else:
        return False
    

def forecastValues(column):

    # d = 0
    # p = 0
    # q = 0
    # MSE = 1000000000000000
    # for i in range(0,3):
    #     for j in range(0,3):
    #         for k in range(0,3):
    #             try:
    #                 model = ARIMA(column, order=(i,j,k))
    #                 fitted_model = model.fit()
    #                 predictions = fitted_model.predict(start=0, end=len(column)-1)
    #                 mse = mean_squared_error(column, predictions)
    #                 if(mse < MSE):
    #                     MSE = mse
    #                     p=i
    #                     d=j
    #                     q=k
    #             except:
    #                 print()

    sarima_model = SARIMAX(column, order=(1,1,1), seasonal_order=(1,1,1, 4))
    results = sarima_model.fit(disp=False)
    predictions = results.predict(start=0, end=len(column)-1, dynamic=False)
    mse = mean_squared_error(column, predictions)

    forecast_steps = 20
    forecast = results.forecast(steps=forecast_steps)
    return [forecast,mse]


def sarima(file):
    
    data = pd.read_csv(file)

    data['High'] = data['High'].fillna(data['High'].mean())
    data['Low'] = data['Low'].fillna(data['Low'].mean())
    data['Open'] = data['Open'].fillna(data['Open'].mean())
    data['Close'] = data['Close'].fillna(data['Close'].mean())
    data['Volume'] = data['Volume'].fillna(data['Volume'].mean())
    data['Marketcap'] = data['Marketcap'].fillna(data['Marketcap'].mean())

    forecasts = {}

    [values,mse] = forecastValues(data['High'])
    img = create_chart(data['High'], values, 'Time', 'Price', 'Highest price of the coin')
    forecasts['High'] = {
        'img': img,
        'values': values.tolist(),
        'mse': mse
    }

    [values,mse] = forecastValues(data['Low'])
    img = create_chart(data['Low'], values, 'Time', 'Price', 'Lowest price of the coin')
    forecasts['Low'] = {
        'img': img,
        'values': values.tolist(),
        'mse': mse
    }
    
    [values,mse] = forecastValues(data['Open'])
    img = create_chart(data['Open'], values, 'Time', 'Price', 'Opening price of the coin')
    forecasts['Open'] = {
        'img': img,
        'values': values.tolist(),
        'mse': mse
    }
    
    [values,mse] = forecastValues(data['Close'])
    img = create_chart(data['Close'], values, 'Time', 'Price', 'Closing price of the coin')
    forecasts['Close'] = {
        'img': img,
        'values': values.tolist(),
        'mse': mse
    }
    
    [values,mse] = forecastValues(data['Volume'])
    img = create_chart(data['Volume'], values, 'Time', 'Price', 'Volume of the coin')
    forecasts['Volume'] = {
        'img': img,
        'values': values.tolist(),
        'mse': mse
    }
    
    [values,mse] = forecastValues(data['Marketcap'])
    img = create_chart(data['Marketcap'], values, 'Time', 'Price', 'Marketcap of the coin')
    forecasts['Marketcap'] = {
        'img': img,
        'values': values.tolist(),
        'mse': mse
    }

    return forecasts