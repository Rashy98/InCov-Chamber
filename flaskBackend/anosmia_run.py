from flask import Flask
from flask_cors import CORS
import pandas as pd
import pickle
# from Anosmia.yes_no_classifier import util_classifier
from Anosmia.voice_to_text import voice_to_text
from Anosmia.arduino import arduino_value
from Anosmia.yes_no_classifier import util_classifier
from Anosmia.fragrance_type_classifier import fragrance_type_classifier



status = ""

def anosmiaChecker():

# ---------------------------Main Code in Voice to text------------------
    data = pd.read_csv('./Anosmia/yes_no_classifier/data.txt', delimiter=",")
    model = pickle.load(open('./Anosmia/yes_no_classifier/finalized_YesNoClassifer_model.pkl', 'rb'))
    # print(data.head())

    # dataFrag = pd.read_csv('./Anosmia/fragrance_type_classifier/smellNameList.txt', delimiter=",")
    # modelFrag = pickle.load(open('./Anosmia/fragrance_type_classifier/finalized_FragranceNameClassifer_model.pkl', 'rb'))

    text = voice_to_text.voiceText()
    print(text)

    classifierValue =''
    if(text != ""):
        util_classifier.getData(df=data)
        classifierValue = util_classifier.train(text)


    # ----------------------------Main Code in arduino----------------------
    print('Program started')

    threshold_value = 1500
    # Setting up the Arduino
    arduinoValue = arduino_value.getSensorValue()
    print(arduinoValue)

    # ----------------------------Comparing---------------------------------


    if(classifierValue == 'yes' and float(arduinoValue) > threshold_value):
        status = 'healthy'
        print('healthy')

    elif (classifierValue == 'yes' and float(arduinoValue) < threshold_value):
        status = 'prashnayak'
        print('prashnayak')

    elif (classifierValue == 'no' and float(arduinoValue) < threshold_value):
        status = 'healthy'
        print('healthy')

    else:
        status = 'anosmia'
        print('Anosmia');


    Anosmia_response = {
       'status':status
      }

    return Anosmia_response



