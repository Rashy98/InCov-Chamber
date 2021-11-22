"""
    All anosmia related methods
"""

# Importing needed libraries
from flask import Flask
from flask_cors import CORS
import pandas as pd
import numpy as np
import pickle
import logging
from Anosmia.voice_to_text import voice_to_text
from Anosmia.arduino import arduino_value
from Anosmia.yes_no_classifier import util_classifier
from cough.AudioRecording import audioRecorder
from scipy.io.wavfile import write

# initialize variables
status = ""
arduinoValue = 0

# initializing log related variables
# log_file_path = './logs/anosmia.log'
# log_format = '%(asctime)s : %(levelname)s : %(funcName)s : %(lineno)d : %(message)s'

# initialize the logger
# logger = logging.getLogger(__name__)
# logger.setLevel(logging.INFO)
# file_handler = logging.FileHandler(log_file_path)
# formatter = logging.Formatter(log_format)
# file_handler.setFormatter(formatter)
# logger.addHandler(file_handler)


def recordSound():
    """
        Method to record user response and convert it into text
        :return: convertedText
    """
    # logger.info('Anosmia component started.')

    recording = audioRecorder.recordAnosmia()
    y = (np.iinfo(np.int32).max * (recording / np.abs(recording).max())).astype(np.int32)
    write('anosmia.wav', 44100, y)
    text = voice_to_text.voiceText('anosmia.wav')
    print(text)
    convertedText = anosmiaChecker(text)
    return convertedText


def anosmiaChecker(text):
    """
        method to classify the text and get the sensor reading value
        :param text: user response after converted to the text
        :return: Anosmia_response
    """

    # initializing the directory containing the training data
    data = pd.read_csv('./Anosmia/yes_no_classifier/data.txt', delimiter=",")
    model = pickle.load(open('./Anosmia/yes_no_classifier/finalized_YesNoClassifer_model.pkl', 'rb'))

    classifierValue = ''
    if (text != ""):
        util_classifier.getData(df=data)
        classifierValue = util_classifier.train(text)
        print(classifierValue)

    # Setting up the Arduino
    arduinoValue = arduino_value.getSensorValue()
    print(arduinoValue)

    Anosmia_response = {
        'classifier_value': classifierValue,
        'arduino_value': float(arduinoValue)
    }
    return Anosmia_response


def getArduinoValue():
    """
        Method to get arduino value from the sensor
        :return: arduinoValue
    """
    return arduinoValue
