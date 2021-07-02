from flask import Flask
from flask_cors import CORS
import pandas as pd
import pickle
# from Anosmia.yes_no_classifier import util_classifier
from Anosmia.voice_to_text import voice_to_text
from Anosmia.fragrance_type_classifier import fragrance_type_classifier
import anosmia_run



status = ""

def anosmiaFragChecker():

    arduinoValue = anosmia_run.getArduinoValue()

# ---------------------------Main Code in Voice to text------------------

    dataFrag = pd.read_csv('./Anosmia/fragrance_type_classifier/smellNameList.txt', delimiter=",")
    modelFrag = pickle.load(open('./Anosmia/fragrance_type_classifier/finalized_FragranceNameClassifer_model.pkl', 'rb'))

    text = voice_to_text.Frag()
    print(text)

    classifierFragValue =''
    if(text != ""):
        fragrance_type_classifier.getfragranceData(df=dataFrag)
        classifierFragValue = fragrance_type_classifier.fragrancetrain(text)


    threshold_value = 1500

    # ----------------------------Comparing---------------------------------

    if(classifierFragValue == 'lavender' and float(arduinoValue) > threshold_value):
        status = 'healthy'
        print('healthy')

    elif (classifierFragValue == 'lavender' and float(arduinoValue) < threshold_value):
        status = 'healthy'
        print('healthy')

    elif (classifierFragValue == 'cinnamon' and float(arduinoValue) < threshold_value):
        status = 'LIAR'
        print('LIAR')

    else:
        status = 'LIAR'
        print('LIAR');


    Anosmia_response = {
        'status':status
      }

    return Anosmia_response



