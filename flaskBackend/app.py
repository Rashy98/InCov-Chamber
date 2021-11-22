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
    """
        API to run the temperature and SOB module

        :return: the combined results of the both components
    """
    return jsonify(camera_module_run.run_thermal_modules())


@app.route("/face_auth", methods=["GET"])
def face_auth():
    """
        API to call the face authentication module

        :return: identified person name
    """
    return jsonify(camera_module_run.run_auth_module())


if __name__ == "__main__":
    app.run(host='127.0.0.1', port=5000)

