from flask import Flask, request, jsonify
from flask_cors import CORS
from ARIMA import arima 
from SARIMA import sarima
from ExponentialSmoothing import expo_smoothing

app = Flask(__name__)
CORS(app)


@app.route('/')
def home():
    return "Welcome to your basic Flask app!"


@app.route('/getForecast', methods=['GET','POST'])
def getForecast():

    if 'file' not in request.files:
        return jsonify({"error": "No file found."}), 400

    file = request.files['file']
    model = request.form['model']

    if model == 'arima':
        forecasts = arima(file)
    elif model == 'sarima':
        forecasts = sarima(file)
    elif model == "es":
        forecasts = expo_smoothing(file)

    return jsonify(forecasts)

if __name__ == '__main__':
    app.run(debug=True)
