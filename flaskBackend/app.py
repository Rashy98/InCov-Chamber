#!/usr/bin/python7
"""
Defining APIs
"""

# Importing needed libraries
from flask import Flask, jsonify
from flask_cors import CORS
import cough_run
import anosmia_run
import anosmia_fragrance_classifier_run
from sob import SOB
import camera_module_run

app = Flask(__name__, static_url_path='', static_folder='./build')
CORS(app)


@app.route('/recordCough', methods=['GET', 'POST'])
def recordCough():
    """
        API to record cough
        :return: cough_recording: recording status
    """
    cough_recording_status = cough_run.record_cough()
    return cough_recording_status


@app.route('/hello')
def say_hello_world():
    return {'result': "Hello World"}


@app.route("/predictCough", methods=["GET", "POST"])
def detection():
    """
        API to predict whether the cough is COVID-19 positive or not
        :return: cough_resemblance: prediction of cough resemblance
    """
    cough_resemblance = jsonify(cough_run.send_prediction())
    return cough_resemblance


@app.route("/anosmiaFrag", methods=["POST"])
def anosmiaFrag():
    return jsonify(anosmia_fragrance_classifier_run.anosmiaFragChecker())


@app.route("/anosmia", methods=["GET", "POST"])
def anosmia():
    return jsonify(anosmia_run.recordSound())


@app.route("/thermal_module", methods=["GET"])
def sob():
    return jsonify(camera_module_run.run_thermal_modules())


@app.route("/get_temperature", methods=["GET"])
def temperature():
    return jsonify(camera_module_run.get_temperature())


@app.route("/get_breath_count", methods=["GET"])
def breath_count():
    return jsonify(camera_module_run.get_breath_count())


@app.route("/face_auth", methods=["GET"])
def face_auth():
    return jsonify(camera_module_run.run_auth_module())


if __name__ == "__main__":
    app.run(host='127.0.0.1', port=5000)

