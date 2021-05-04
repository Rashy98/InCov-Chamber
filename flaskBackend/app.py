#!/usr/bin/python7
from flask import Flask, request, jsonify,render_template, redirect, url_for
from flask_cors import CORS
# from cough_run import coughResemb
import cough_run
from cough.AudioRecording import recordAudio
import anosmia_run
from cough.CreateSpectogram import  Create_spectogram
import os
import wave
app = Flask(__name__, static_url_path='', static_folder='./build')
CORS(app)



if(os.stat('cough.wav').st_size == 0):
    'No audio'
else:
    coughRecording = 'cough.wav'
    Create_spectogram.createWavelets(cough = coughRecording)


@app.route('/hello')
def say_hello_world():
    return {'result': "Hello World"}

@app.route("/predictCough", methods=["GET","POST"])
def detection():
    return jsonify(cough_run.sendPrediction())

if __name__ == "__main__":
    app.run(host='127.0.0.1', port=5000)


