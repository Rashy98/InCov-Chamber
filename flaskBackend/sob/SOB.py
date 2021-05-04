from imutils import face_utils
import cv2 as cv
import numpy as np
import dlib
import imutils

width_500 = 500
width_250 = 250
feature_start = 30
feature_end = 36

detector = dlib.get_frontal_face_detector()
predictor = dlib.shape_predictor('./trainingModels/shape_predictor_68_face_landmarks.dat')

def resizeImage(img):
    return imutils.resize(image=img, width=width_500)

def highlightROI(clone, shape):
    for (x, y) in shape[feature_start:feature_end]:
        cv.circle(clone, (x,y), 1, (0, 0, 255), -1)

def getNormalROI(frame, x, y, w, h):
    roi = frame[y:y + h, x:x + w]
    roi = imutils.resize(roi, width=width_250, inter=cv.INTER_CUBIC)

    return roi

def getThermalROI(frame, x, y, w, h):
    roi_thermal = frame[y:y + h, x:x + w]
    roi_thermal = imutils.resize(roi_thermal, width=width_250, inter=cv.INTER_CUBIC)

    return roi_thermal

def displayOutput(breath_count, roi_binary, roi, roi_thermal, clone, cap1_frame):
    display_text = ("Breath Count " + str(breath_count))
    cv.putText(roi_binary, display_text, (10, 30), cv.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)

    cv.imshow("ROI Normal", roi)
    cv.imshow("ROI Thermal", roi_thermal)
    cv.imshow("ROI Binary", roi_binary)
    cv.imshow("Clone", clone)
    cv.imshow("Thermal", cap1_frame)

def SOB_run():

    cap0 = cv.VideoCapture(0)
    cap1 = cv.VideoCapture(1)

    low_green = np.array([50, 50, 55])
    high_green = np.array([95, 255, 255])

    breath_count = 0
    previous_frame = 0

    while True:
        isTrue, cap0_frame = cap0.read()
        _, cap1_frame = cap1.read()

        cap0_frame = resizeImage(cap0_frame)
        cap1_frame = resizeImage(cap1_frame)

        frame_gray = cv.cvtColor(cap0_frame, cv.COLOR_RGB2GRAY)
        # frame_hsv = cv.cvtColor(cap0_frame, cv.COLOR_RGB2HSV)

        rects = detector(frame_gray, 1)

        for (i, rect) in enumerate(rects):
            shape = predictor(frame_gray, rect)
            shape = face_utils.shape_to_np(shape)

            clone = cap0_frame.copy()
            cv.putText(clone, "Nose", (10, 30), cv.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)

            highlightROI(clone, shape)

            (x, y, w, h) = cv.boundingRect(np.array([shape[feature_start:feature_end]]))
            roi = getNormalROI(cap0_frame, x, y, w, h)
            roi_thermal = getThermalROI(cap1_frame, x, y, w, h)
            hsv_thermal = cv.cvtColor(roi_thermal, cv.COLOR_RGB2HSV)
            roi_binary = cv.inRange(hsv_thermal, low_green, high_green)

            max_pix = np.amax(roi_binary)

            if max_pix >= 255:
                previous_frame = 255
            else:
                if previous_frame == 255:
                    breath_count = breath_count + 1
                    print('Breath Count ', breath_count)

                previous_frame = 0

            displayOutput(breath_count, roi_binary, roi, roi_thermal, clone, cap1_frame)

        if cv.waitKey(20) & 0xFF == ord('q'):
            break

    cap0.release()
    cap1.release()
    cv.destroyAllWindows()

SOB_run()