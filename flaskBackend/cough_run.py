from flask import Flask, request, jsonify,render_template, redirect, url_for
from flask_cors import CORS
import io
import tensorflow as tf
import base64
# from PIL import Image
from keras.applications.vgg16 import VGG16
from keras.preprocessing import image
from keras.models import Sequential, load_model
from keras.preprocessing.image import load_img
from keras.preprocessing.image import img_to_array
from keras.applications.vgg16 import preprocess_input
from keras.applications.vgg16 import decode_predictions
from keras.applications.vgg16 import VGG16
import numpy as np
# import json
import json
# from pyimagesearch import config
import logging
from keras.models import model_from_json
from keras.layers import Layer
from cough.AudioRecording import audioRecorder
import time
from cough.CreateSpectogram import Create_spectogram
import os
from scipy.io.wavfile import write,read


class LabelLimitLayer(Layer):

    def __init__(self, labels, topn, **kwargs):
        self.labels = labels
        self.topn = topn
        super(LabelLimitLayer, self).__init__(**kwargs)

    def call(self, x):
        batch_size = tf.shape(x)[0]

        tf_labels = tf.constant([self.labels], dtype="string")
        tf_labels = tf.tile(tf_labels,[batch_size,1])

        top_k = tf.nn.top_k(x, k=self.topn, sorted=True, name="top_k").indices

        top_conf = tf.gather(x, top_k, batch_dims=1)
        top_labels = tf.gather(tf_labels, top_k, batch_dims=1)
        return [top_conf, top_labels]

    def compute_output_shape(self, input_shape):
        batch_size = input_shape[0]
        top_shape = (batch_size, self.topn)
        return [top_shape, top_shape]

    def get_config(self):
        config={'labels':self.labels,
                'topn':self.topn}
        base_config = super(LabelLimitLayer, self).get_config()
        return dict(list(base_config.items()) + list(config.items()))



# with open("coughResemblance_label_map.json", 'r') as f:
#     class_names = json.load(f)
#
# items = list(class_names.items())
# class_names_arr = np.array(items)
# print(class_names_arr);
#
# with open("cough_label_map.json", 'r') as f:
#     class_names_detect = json.load(f)
#
# items = list(class_names_detect.items())
# class_names_detect_arr = np.array(items)




def getModel():

    global model
    model= tf.keras.models.load_model('cough/cough-resemblance/myVggCoughResModel.h5', custom_objects={"LabelLimitLayer":LabelLimitLayer})
    model.summary();
    print('* Model Loaded!')

def getDetectModel():
    global detectModel
    detectModel = tf.keras.models.load_model('cough/cough-detection/myVggCoughDetectionModel.h5',custom_objects={"LabelLimitLayer":LabelLimitLayer})
    detectModel.summary();
    # model = load_model('esc50_vgg19_stft_weights_train_last_3_base_layers_best.hdf5')
    print('* detectModel Loaded!')

def preprocess_image(image, target_size):
    if image.mode != "RGB":
        image = image.convert("RGB")
    image = image.resize(target_size)
    image = img_to_array(image)
    image = np.expand_dims(image, axis=0)
    return image

print(" * Loading Keras models...")


getModel()

getDetectModel()


def get_top_k_predictions(preds, label_map, k=5, print_flag=False):
    print(label_map)
    sorted_array = np.argsort(preds)[::-1]
    top_k = sorted_array[:k]
    label_map_flip = dict((v,k) for k,v in label_map.items())
    y_pred = []
    for label_index in top_k:
        if print_flag:
            print("{} ({})".format(label_map_flip[label_index], preds[label_index]))
        y_pred.append(label_map_flip[label_index])
    return y_pred


categories = ['healthy','positive']
detect_categories =  ['coughing','non-cough']


def predict():
    image_prediction = image.load_img('./spectograms/spectogram.png', target_size=(224, 224))
    x = image.img_to_array(image_prediction)
    x = np.expand_dims(x, axis=0)* 1./255
    # xNo = np.expand_dims(x, axis=0)
    preds = model.predict(x)
    # print("preds:" ,preds)
    # print(categories[np.argmax(preds[0])])
    # print(preds[0][np.argmax(preds[0])])
    # print(preds)
    return (preds)


def detect():
    image_prediction = image.load_img('./spectograms/spectogram.png', target_size=(224, 224))
    x = image.img_to_array(image_prediction)
    x = np.expand_dims(x, axis=0)* 1./255
    predDe = detectModel.predict(x)
    return detect_categories[np.argmax(predDe[0])]

def sendPrediction():
    if detect() == 'coughing':
        print(detect())
        preds = predict()
        print(preds)
        response = {
            'prediction_label': categories[np.argmax(preds[0])],
            'percentage': str(preds[0][np.argmax(preds[0])])
        }
        return response
    else:
        response = {
            'prediction_label': 'no cough',
        }
        return response

def coughResemb():
    if (detect() == 'coughing'):
        predict()
    else:
        print('No cough found')

def recordCough():
    recording = audioRecorder.recordCough()
    write('cough.wav', 44100, recording)
    # time.sleep(8)
    # coughRecording = read('cough.wav')
    # Create_spectogram.createWavelets(recording)
    if (os.stat('cough.wav').st_size == 0):
        'No audio'
    else:
        coughRecording = 'cough.wav'
        Create_spectogram.createWavelets(cough=coughRecording)

    return 'Recording done'


# print(detect())

# recordCough()
# Create_spectogram.createWavelets(cough='cough.wav')