import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from statsmodels.tsa.holtwinters import SimpleExpSmoothing
from sklearn.metrics import mean_squared_error
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

def forecastValues(data):
    model = SimpleExpSmoothing(data).fit(smoothing_level=0.5, optimized=False)

    forecast = model.forecast(steps=20)

    mse = mean_squared_error(data,model.fittedvalues)
    return [forecast,mse]

def expo_smoothing(file):
    
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