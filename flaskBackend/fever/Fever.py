"""
    This module will detect the high body temperature of a person
"""

# import needed libraries
from imutils import contours
import numpy as np
import imutils
import cv2 as cv
import logging

log_file_path = './logs/sob.log'
log_format = '%(asctime)s : %(levelname)s : %(funcName)s : %(lineno)d : %(message)s'

OCR_B = cv.imread('./fever/OCR-B.jpg')


# initialize the logger
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)
file_handler = logging.FileHandler(log_file_path)
formatter = logging.Formatter(log_format)
file_handler.setFormatter(formatter)
logger.addHandler(file_handler)


def getReference():
    """
        Using and configuring the reference image that is for Optical Character Recognition as needed
        :return:ref: Configured reference image
    """
    ref = cv.cvtColor(OCR_B, cv.COLOR_BGR2GRAY)
    ref = cv.threshold(ref, 10, 255, cv.THRESH_BINARY_INV)[1]

    return ref

def getRefCnts(ref):
    """

        :param ref: Configured reference image using the 'getReference()' method
        :return: refCnts:
    """
    refCnts = cv.findContours(ref.copy(), cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE)
    refCnts = imutils.grab_contours(refCnts)
    refCnts = contours.sort_contours(refCnts, method="left-to-right")[0]
    return refCnts


def getDigits(refCnts, ref, digits):
    """

        :param refCnts:
        :param ref: Configured reference image using the 'getReference()' method
        :param digits: Empty array used to store the created digits
        :return: digits
    """
    for (i, c) in enumerate(refCnts):
        (x, y, w, h) = cv.boundingRect(c)
        roi = ref[y:y + h, x:x + w]
        roi = cv.resize(roi, (57, 88))
        digits[i] = roi

    return digits

def getGradX(tophat, rectKernel):

    gradX = cv.Sobel(tophat, ddepth=cv.CV_32F, dx=1, dy=0, ksize=-1)
    gradX = np.absolute(gradX)
    (minVal, maxVal) = (np.min(gradX), np.max(gradX))
    gradX = (255 * ((gradX - minVal) / (maxVal - minVal)))
    gradX = gradX.astype("uint8")

    gradX = cv.morphologyEx(gradX, cv.MORPH_CLOSE, rectKernel)

    return gradX

def getLocs(cnts, locs):
    for (i, c) in enumerate(cnts):
        (x, y, w, h) = cv.boundingRect(c)
        ar = w / float(h)
        if 2.5 < ar < 4.0:
            if (20 < w < 70) and (10 < h < 50):
                locs.append((x, y, w, h))
    locs = sorted(locs, key=lambda x: x[0])

    return locs

def getDigiCnts(group):
    digitCnts = cv.findContours(group.copy(), cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE)
    digitCnts = imutils.grab_contours(digitCnts)
    digitCnts = contours.sort_contours(digitCnts, method="left-to-right")[0]

    return digitCnts

def Fever_start(cap1):
    """
        Reading the thermal image to obtain the characters (temperature)
        :param cap1: camera instance for thermal camera
        :return: tot: Final temperature after getting the average of 10 read values
    """
    tot = 0

    while tot == 0:
        _, frame = cap1.read()

        frame = imutils.resize(image=frame, width=500)
        try:
            frame = imutils.resize(image=frame, width=500)
        except AttributeError:
            logger.critical("Cannot load the frame. Check for camera connection")
            pass

        cv.imshow('temp', frame)
        frame = frame[:50, :88]
        frame_gray = cv.cvtColor(frame, cv.COLOR_BGR2GRAY)

        ref = getReference()

        refCnts = getRefCnts(ref)
        digits = {}

        digits = getDigits(refCnts, ref, digits)

        rectKernel = cv.getStructuringElement(cv.MORPH_RECT, (9, 3))
        sqKernel = cv.getStructuringElement(cv.MORPH_RECT, (5, 5))

        tophat = cv.morphologyEx(frame_gray, cv.MORPH_TOPHAT, rectKernel)
        gradX = getGradX(tophat, rectKernel)

        thresh = cv.threshold(gradX, 0, 255, cv.THRESH_BINARY | cv.THRESH_OTSU)[1]
        thresh = cv.morphologyEx(thresh, cv.MORPH_CLOSE, sqKernel)

        cnts = cv.findContours(thresh.copy(), cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE)
        cnts = imutils.grab_contours(cnts)

        locs = []
        locs = getLocs(cnts, locs)

        output = []

        for (i, (gX, gY, gW, gH)) in enumerate(locs):
            groupOutput = []
            # group = frame_gray[gY - 5:gY + gH + 5, gX - 5:gX + gW + 5]
            group = frame_gray[gY - 5:gY + gH + 2, gX - 5:gX + gW + 5]

            group = cv.threshold(group, 0, 255, cv.THRESH_BINARY | cv.THRESH_OTSU)[1]

            digitCnts = getDigiCnts(group)

            for c in digitCnts:
                (x, y, w, h) = cv.boundingRect(c)
                roi = group[y:y + h, x:x + w]
                roi = cv.resize(roi, (57, 88))

                scores = []

                for (digit, digitROI) in digits.items():
                    result = cv.matchTemplate(roi, digitROI, cv.TM_CCOEFF_NORMED)
                    (_, score, _, _) = cv.minMaxLoc(result)
                    scores.append(score)

                groupOutput.append(str(np.argmax(scores)))


            cv.rectangle(frame, (gX - 5, gY - 5), (gX + gW + 5, gY + gH + 5), (0, 0, 255), 2)
            cv.putText(frame, "".join(groupOutput), (gX, gY - 15), cv.FONT_HERSHEY_SIMPLEX, 0.65, (0, 0, 255), 2)
            output.extend(groupOutput)

            output[2] = '.'
            temp = float("".join(output))
            tot = tot + temp

        if cv.waitKey(20) & 0xFF == ord('q'):
            break


    print('Temperature ', tot)

    cv.destroyAllWindows()
    return tot