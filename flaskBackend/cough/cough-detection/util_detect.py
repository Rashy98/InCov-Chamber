"""
To process and make the data needed for training and testing
"""

# Importing needed libraries
import os
import numpy as np
import cv2
import pickle

# initializing the directory containing the training data
data_dir = '../data/training_detect'


categories_detection = ['coughing', 'non-cough']  # initializing the categories

data = []    # global variable to store the data


def make_data():
    """
        Build the data for the cough detection model and saving the pickle file

    """

    for detect_category in categories_detection:

        detect_path = os.path.join(data_dir, detect_category)
        detect_label = categories_detection.index(detect_category)

        for detect_spectrogram in os.listdir(detect_path):
            image_path = os.path.join(detect_path, detect_spectrogram)
            image = cv2.imread(image_path)

            try:
                image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
                image = cv2.resize(image, (224, 224))
                image = np.array(image)

                data.append([image, detect_label])

            except Exception as e:
                pass

    pik = open('cough_detection.pickle', 'wb')  # opening pickle file with writing access
    pickle.dump(data, pik)  # saving the pickle file
    pik.close()  # closing the file


def load_data():
    """
    Retrieve the built data for model training and return the features and labels
    :return: feature_label_array
    """

    pickle_detection = open('cough_detection.pickle', 'rb')
    data_detection = pickle.load(pickle_detection)
    pickle_detection.close()

    feature = []
    labels = []

    for img, label in data_detection:
        feature.append(img)   # get all features
        labels.append(label)  # get all labels

    feature = np.array(feature, dtype=np.float32)   # convert features into array
    feature = feature / 255.0

    labels = np.array(labels)  # convert labels into array

    feature_label_array = [feature, labels]

    return feature_label_array


make_data()
