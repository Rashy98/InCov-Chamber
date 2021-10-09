"""
    This module will calculate the respiration rate

    Contains all the methods related SOB module

    Returns total breath count
"""

from imutils import face_utils
from flaskBackend.logs import log_handler
import cv2 as cv
import numpy as np
import dlib
import imutils
import time

# initialize variables
width_500 = 500
width_250 = 250
feature_start = 30
feature_end = 36

# initialize dlib's face detector (HOG-based) and then create
# the facial landmark predictor
detector = dlib.get_frontal_face_detector()
predictor = dlib.shape_predictor('./sob/trainingModels/shape_predictor_68_face_landmarks.dat')


def resize_image(img):
    """
        Resize the image to 500 pixels width

        :param img: image to resize
        :return: resized image
    """

    try:
        return imutils.resize(image=img, width=width_500)
    except AttributeError:
        log_handler.log("sob", "CRITICAL", "resize_image", 38, "Cannot load the frame. Check for camera connection")


def highlight_roi(clone, shape):
    """
        Highlights the nostril area of the frames by web camera

        :param clone: a clone of the frame from average web camera
        :param shape: numpy array which contains (x,y) coordinates of facial landmarks
    """
    for (x, y) in shape[feature_start:feature_end]:
        cv.circle(clone, (x, y), 1, (0, 0, 255), -1)


def get_nostril_area(frame, x, y, w, h):
    """
        Extract nostril area from the received frame

        :param frame: frame to extract the nostril area
        :param x: starting x coordinate of the ROI
        :param y: starting y coordinate of the ROI
        :param w: width of the ROI to be extracted
        :param h: height of the ROI to be extracted
        :return: extracted ROI (nostril area)
    """
    roi = frame[y:y + h, x:x + w]
    roi = imutils.resize(roi, width=width_250, inter=cv.INTER_CUBIC)

    return roi


# def get_thermal_roi(frame, x, y, w, h):
#     roi_thermal = frame[y:y + h, x:x + w]
#     roi_thermal = imutils.resize(roi_thermal, width=width_250, inter=cv.INTER_CUBIC)
#
#     return roi_thermal


def display_output(breath_count, roi_binary, roi, roi_thermal, clone, cap1_frame):
    display_text = ("Breath Count " + str(breath_count))
    cv.putText(roi_binary, display_text, (10, 30), cv.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)

    cv.imshow("ROI Normal", roi)
    cv.imshow("ROI Thermal", roi_thermal)
    cv.imshow("ROI Binary", roi_binary)
    cv.imshow("Clone", clone)
    cv.imshow("Thermal", cap1_frame)


def sob_run(cap0, cap1):
    """
        Starts the SOB component

        :param cap0: camera instance for web camera
        :param cap1: camera instance for thermal camera
        :return: total breath count within 30 seconds
    """

    # defined lower and upper hue values of green color
    # used to highlight color change near nostril area
    low_green = np.array([30, 52, 72])
    high_green = np.array([110, 255, 255])

    # initialize temporary variables
    breath_count = 0
    previous_frame = 0
    time_end = time.time() + 30

    while time.time() < time_end:
        # accepts frames from the cameras
        is_true, cap0_frame = cap0.read()
        is_true, cap1_frame = cap1.read()

        cap0_frame = resize_image(cap0_frame)
        cap1_frame = resize_image(cap1_frame)

        frame_gray = cv.cvtColor(cap0_frame, cv.COLOR_RGB2GRAY)  # convert web camera's frame to gray scale

        rects = detector(frame_gray, 1)  # detect the faces in gray scale image

        for (i, rect) in enumerate(rects):
            shape = predictor(frame_gray, rect)  # determine facial landmarks
            shape = face_utils.shape_to_np(shape)  # converts landmark (x,y) coordinates to numpy array

            clone = cap0_frame.copy()
            cv.putText(clone, "Nose", (10, 30), cv.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)

            highlight_roi(clone, shape)

            # get (x,y) coordinates, width, height of the nostril area by passing staring and ending landmarks
            # of the nostril area referring to dlib's 68 facial landmarks
            (x, y, w, h) = cv.boundingRect(np.array([shape[feature_start:feature_end]]))

            roi_normal = get_nostril_area(cap0_frame, x, y, w, h)  # get nostril area from web camera's frame
            roi_thermal = get_nostril_area(cap1_frame, x, y, w, h)  # get nostril area from thermal camera's frame
            hsv_thermal = cv.cvtColor(roi_thermal, cv.COLOR_BGR2HSV)  # convert roi_thermal to hsv
            roi_binary = cv.inRange(hsv_thermal, low_green, high_green)  # get binary image of breathing

            max_pix = np.amax(roi_binary)  # get maximum pixel value of the binary image

            # count each breathing by analysing the roi_binary
            # if (max_pix == 0) and (previous_frame == 255) then, increments the breath count by 1
            if max_pix >= 255:
                previous_frame = 255
            else:
                if previous_frame == 255:
                    breath_count = breath_count + 1
                    print('Breath Count ', breath_count)

                previous_frame = 0

            display_output(breath_count, roi_binary, roi_normal, roi_thermal, clone, cap1_frame)

        if cv.waitKey(20) & 0xFF == ord('q'):
            break

    cv.destroyAllWindows()

    return breath_count

