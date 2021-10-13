"""
To process and make the data needed for training and testing for cough resemblance
"""

# Importing needed libraries
import numpy as np
import cv2
import os
import pickle


data_dir = '../data/training'  # Initializing the directory containing the training data

categories = ['healthy', 'positive']  # initializing the cough resemblance categories

data = []  # global variable to store the data


def make_data():
    """
    Build the data for the cough resemblance model and saving the pickle file
    """
    for category in categories:
        path = os.path.join(data_dir, category)
        label = categories.index(category)

        for img_name in os.listdir(path):
            image_path = os.path.join(path, img_name)
            image = cv2.imread(image_path)

            try:
                image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
                image = cv2.resize(image, (224, 224))
                image = np.array(image)

                data.append([image, label])

            except Exception as e:
                pass

    print(len(data))
    pik = open('cough_resemblance.pickle', 'wb')  # opening pickle file with writing access
    pickle.dump(data, pik)  # saving the pickle file
    pik.close()  # closing the file


def load_data():
    """
        Retrieve the built data for model training and return the features and labels
        :return: feature_label_array
    """

    pick = open('cough_resemblance.pickle', 'rb')
    data = pickle.load(pick)

    pick.close()

    feature = []
    labels = []

    for img, label in data:
        feature.append(img)  # get all features
        labels.append(label)  # get all labels

    feature = np.array(feature, dtype=np.float32)  # convert features into array
    feature = feature / 255.0

    labels = np.array(labels)  # convert labels into array

    array_feature_label = [feature, labels]

    return array_feature_label


make_data()
