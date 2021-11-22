import cv2 as cv

from fever import Fever
from sob import SOB
from FaceRecognition import FaceRecog

cap0 = cv.VideoCapture(0)
cap1 = cv.VideoCapture(1)


def run_auth_module():
    emp_name = FaceRecog.run_face_recog(cap0)

    result = {
        'emp_name': emp_name
    }

    return result


def run_thermal_modules():
    temperature = Fever.Fever_start(cap1)
    breath_count = SOB.sob_run(cap0, cap1)

    result = {
        'temperature': temperature,
        'breath_count': breath_count
    }

    return result


def get_temperature():
    temperature = Fever.Fever_start(cap1)

    result = {
        'temperature': temperature
    }
    return result


def get_breath_count():
    breath_count = SOB.sob_run(cap0, cap1)

    result = {
        'breath_count': breath_count
    }
    return result


def release_caps():
    print('Caps released -------------------------------------------------------------------')

