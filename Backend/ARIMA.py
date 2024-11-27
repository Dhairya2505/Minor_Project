import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from statsmodels.tsa.arima.model import ARIMA
from statsmodels.graphics.tsaplots import plot_acf, plot_pacf
from sklearn.metrics import mean_squared_error
from statsmodels.tsa.stattools import adfuller

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
    # for i in range(0,4):
    #     for j in range(0,4):
    #         for k in range(0,4):
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

    model = ARIMA(column, order=(1,1,1))
    fitted_model = model.fit()
    predictions = fitted_model.predict(start=0, end=len(column)-1)
    mse = mean_squared_error(column, predictions)

    forecast_steps = 20
    forecast = fitted_model.forecast(steps=forecast_steps)
    return [forecast,mse]


def arima(file):
    
    data = pd.read_csv(file)

    data['High'] = data['High'].fillna(data['High'].mean())
    data['Low'] = data['Low'].fillna(data['Low'].mean())
    data['Open'] = data['Open'].fillna(data['Open'].mean())
    data['Close'] = data['Close'].fillna(data['Close'].mean())
    data['Volume'] = data['Volume'].fillna(data['Volume'].mean())
    data['Marketcap'] = data['Marketcap'].fillna(data['Marketcap'].mean())

    forecasts = {}

    [values,mse] = forecastValues(data['High'])
    forecasts['High'] = np.concatenate((np.array(data['High']),np.array(values),np.array([mse])))

    [values,mse] = forecastValues(data['Low'])
    forecasts['Low'] = np.concatenate((np.array(data['Low']),np.array(values),np.array([mse])))
    
    [values,mse] = forecastValues(data['Open'])
    forecasts['Open'] = np.concatenate((np.array(data['Open']),np.array(values),np.array([mse])))
    
    [values,mse] = forecastValues(data['Close'])
    forecasts['Close'] = np.concatenate((np.array(data['Close']),np.array(values),np.array([mse])))
    
    [values,mse] = forecastValues(data['Volume'])
    forecasts['Volume'] = np.concatenate((np.array(data['Volume']),np.array(values),np.array([mse])))
    
    [values,mse] = forecastValues(data['Marketcap'])
    forecasts['Marketcap'] = np.concatenate((np.array(data['Marketcap']),np.array(values),np.array([mse])))
    
    forecasts['index'] = np.arange(0,len(data['High'])+20)

    json_data = {key: value.tolist() if isinstance(value, np.ndarray) else value for key, value in forecasts.items()}

    return json_data