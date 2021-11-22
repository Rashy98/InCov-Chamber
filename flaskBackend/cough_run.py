"""
    All cough related methods
"""

# Importing needed libraries
from cough.AudioRecording import audioRecorder
from cough.CreateSpectogram import Create_spectogram
from keras.preprocessing import image
from scipy.io.wavfile import write
import numpy as np
import os
import tensorflow as tf
import logging

# initializing path to the cough resemblance model path
resemblance_model_path = 'cough/cough-resemblance/myVggCoughResModel.h5'

# initializing path to the cough detection model path
detection_model_path = 'cough/cough-detection/myVggCoughDetectionModel.h5'

# initializing path to the spectrogram
spectrogram_path = './spectograms/spectogram.png'
categories = ['healthy', 'positive']  # Define categories for cough resemblance
detect_categories = ['coughing', 'non-cough']  # Define categories for cough detection

# initializing log related variables
log_file_path = './logs/cough.log'
log_format = '%(asctime)s : %(levelname)s : %(funcName)s : %(lineno)d : %(message)s'

# initialize the logger
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)
file_handler = logging.FileHandler(log_file_path)
formatter = logging.Formatter(log_format)
file_handler.setFormatter(formatter)
logger.addHandler(file_handler)


def record_cough():
    """
        Method to record audio and to convert the recorded audio into a spectrogram
        :returns recording_status
    """

    logger.info('Cough component started.')

    recording = audioRecorder.recordCough()
    write('cough.wav', 44100, recording)

    if os.stat('cough.wav').st_size == 0:
        recording_status = 'No audio'
    else:
        coughRecording = 'cough.wav'
        Create_spectogram.createWavelets(cough=coughRecording)
        recording_status = 'Recording done'

    return recording_status


def get_resemblance_model():
    """
        Method to call cough resemblance model
    """
    global resemblance_model  # creating a global variable for the cough resemblance model
    resemblance_model = tf.keras.models.load_model(resemblance_model_path)
    resemblance_model.summary()  # prints model summary


def get_detection_model():
    """
        Method to call cough detection model
    """
    global detection_model

    detection_model = tf.keras.models.load_model(detection_model_path)
    detection_model.summary()  # prints model summary


def preprocess_image(spectrogram):
    """
        Preprocess acquired spectrogram to use in prediction models
        :param spectrogram: unprocessed spectrogram
        :returns processed spectrogram
    """

    image_array = image.img_to_array(spectrogram)  # convert image to an array
    final_image = np.expand_dims(image_array, axis=0) * 1. / 255
    return final_image


def detect():
    """
           Return prediction of whether the audio contains a cough or not
           :return detection_prediction: return the cough detection prediction label
       """
    image_detection = image.load_img(spectrogram_path, target_size=(224, 224))  # Load spectrogram
    processed_spectrogram_detect = preprocess_image(image_detection)  # preprocess the spectrogram
    predict_detection = detection_model.predict(processed_spectrogram_detect)  # Make the cough detection prediction
    detection_prediction = detect_categories[np.argmax(predict_detection[0])]  # Get the predicted label
    return detection_prediction


def predict():
    """
        Return prediction of whether the cough is COVID-19 positive or not
        :return prediction_resemblance: return the cough resemblance prediction
    """
    image_prediction = image.load_img(spectrogram_path, target_size=(224, 224))  # Load spectrogram
    processed_spectrogram = preprocess_image(image_prediction)  # preprocess the spectrogram
    prediction_resemblance = resemblance_model.predict(processed_spectrogram)  # Make the cough resemblance prediction
    return prediction_resemblance


def send_prediction():
    """
        Check whether the acquired spectrogram contains a cough and if yes, make cough resemblance prediction
        :return: response: return prediction (if a cough is detected) or return 'no cough' as a JSON
    """
    if detect() == 'coughing':
        prediction_resemblance = predict()  # call the 'predict()' method to make the cough resemblance prediction
        response = {
            # get prediction label for cough resemblance
            'prediction_label': categories[np.argmax(prediction_resemblance[0])],

            # get prediction value(confidence) for cough resemblance
            'percentage': str(prediction_resemblance[0][np.argmax(prediction_resemblance[0])])
        }

    else:

        response = {
            'prediction_label': 'no cough',
        }

    return response


get_resemblance_model()  # Loading the cough resemblance model
get_detection_model()  # Loading the cough detection model
record_cough()
