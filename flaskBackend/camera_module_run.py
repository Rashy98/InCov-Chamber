import cv2 as cv

from fever import Fever
from sob import SOB
from FaceRecognition import FaceRecog

# create instances of web and thermal cameras
cap0 = cv.VideoCapture(0)
cap1 = cv.VideoCapture(1)


def run_auth_module():
    """
        Runs the user authentication module

        :return: authenticated user's name
    """
    emp_name = FaceRecog.run_face_recog(cap0)

    result = {
        'emp_name': emp_name
    }

    return result


def run_thermal_modules():
    """
        Runs the both temperature and SOB modules

        :return: combined result of breath count and the temperature
    """
    temperature = Fever.Fever_start(cap1)
    breath_count = SOB.sob_run(cap0, cap1)

    result = {
        'temperature': temperature,
        'breath_count': breath_count
    }

    return result

