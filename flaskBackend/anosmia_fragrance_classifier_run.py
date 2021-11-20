"""
    All anosmia related methods - Fragrance Type Classification
"""

# Importing needed libraries
import pandas as pd
import pickle
from Anosmia.voice_to_text import voice_to_text
from Anosmia.fragrance_type_classifier import fragrance_type_classifier
import anosmia_run

# initialize variables
status = ""


def anosmiaFragChecker():
    """
        Method to convert user response to text
        :return: Anosmia_response
    """

    arduinoValue = anosmia_run.getArduinoValue()

    # initializing the directory containing the training data
    dataFrag = pd.read_csv('./Anosmia/fragrance_type_classifier/smellNameList.txt', delimiter=",")
    modelFrag = pickle.load(
        open('./Anosmia/fragrance_type_classifier/finalized_FragranceNameClassifer_model.pkl', 'rb'))

    text = voice_to_text.Frag()
    print(text)

    classifierFragValue = ''

    if (text != ""):
        fragrance_type_classifier.getfragranceData(df=dataFrag)
        classifierFragValue = fragrance_type_classifier.fragrancetrain(text)

    threshold_value = 1500

    # checking if the user response and the actual oder inside the chamber correlate

    if (classifierFragValue == 'lavender' and float(arduinoValue) > threshold_value):
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
        'status': status
    }

    return Anosmia_response
