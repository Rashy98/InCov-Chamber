"""
    This module will recognize the users through face recognition

"""

# Importing needed libraries
import face_recognition
import cv2 as cv
import numpy as np
import os


def run_face_recog(cap0):

    """
        Performs face recognition

        :param cap0: camera instance for web camera
        :return: name: Recognized person's name
    """

    known_face_encodings = []
    known_face_names = []

    img_dir = "./FaceRecognition/Images/"
    file_list = os.listdir(img_dir)

    for name in file_list:
        img = face_recognition.load_image_file(img_dir+name)
        img_encoding = face_recognition.face_encodings(img)[0]

        known_face_encodings.append(img_encoding)
        known_face_names.append(name[:-4])

    face_locations = []
    face_encodings = []
    face_names = []
    name = ''
    process_this_frame = True

    while name == 'Unknown' or name == '':
        ret, frame = cap0.read()

        small_frame = cv.resize(frame, (0, 0), fx=0.25, fy=0.25)

        rgb_small_frame = small_frame[:, :, ::-1]

        if process_this_frame:
            # Find all the faces and face encodings in the current frame of video
            face_locations = face_recognition.face_locations(rgb_small_frame)
            face_encodings = face_recognition.face_encodings(rgb_small_frame, face_locations)

            face_names = []

            for face_encoding in face_encodings:
                # See if the face is a match for the known face(s)
                matches = face_recognition.compare_faces(known_face_encodings, face_encoding)
                name = "Unknown"

                face_distances = face_recognition.face_distance(known_face_encodings, face_encoding)
                best_match_index = np.argmin(face_distances)
                if matches[best_match_index]:
                    name = known_face_names[best_match_index]

                face_names.append(name)

        process_this_frame = not process_this_frame

        # Display the results
        for (top, right, bottom, left), name in zip(face_locations, face_names):
            # Scale back up face locations since the frame we detected in was scaled to 1/4 size
            top *= 4
            right *= 4
            bottom *= 4
            left *= 4

            cv.rectangle(frame, (left, top), (right, bottom), (0, 0, 255), 1)
            cv.putText(frame, name, (left + 6, bottom -6), cv.FONT_HERSHEY_SIMPLEX, 1.0, (0, 0, 0), 2)

        cv.imshow('Video', frame)

        if cv.waitKey(20) & 0xFF == ord('q'):
            break


    cv.destroyAllWindows()
    return name