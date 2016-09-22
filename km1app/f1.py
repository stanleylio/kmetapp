# -*- coding: utf-8 -*-
import traceback
from flask import Flask,render_template,request
from km1app import app
from json import dumps


@app.route('/')
def route_index():
    return render_template('index.html')

@app.route('/by_sensor/par/')
def by_sensor_par():
    return render_template('par.html')

@app.route('/by_sensor/pir/')
def by_sensor_pir():
    return render_template('pir.html')

@app.route('/by_sensor/psp/')
def by_sensor_psp():
    return render_template('psp.html')

#@app.route('/by_sensor/ultrasonic')
#def by_sensor_ultrasonic():
#    return render_template('ultrasonic.html')

@app.route('/by_sensor/bme280/')
def by_sensor_bme280():
    return render_template('bmechart.html')

@app.route('/by_variable/apparent_wind_polar/')
def by_variable_apparent_wind_polar():
    return render_template('windpolar.html')

@app.route('/by_variable/apparent_wind_graph/')
def by_variable_apparent_wind_graph():
    return render_template('windchart.html')

@app.route('/info/')
def info():
    return render_template('info.html')

@app.route('/faq/')
def faq():
    return render_template('faq.html')

@app.route('/about/')
def about():
    return render_template('about.html')

@app.route('/processing/')
def processing():
    return render_template('processing.html')
