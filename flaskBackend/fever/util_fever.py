"""
    This module will detect the high body temperature of a person
"""

import os
import numpy as np
import cv2
import pickle

# load images from file
data_dir = './Data/'
categories = ["0","1","2","3","4","5","6","7","8","9"]

# initialize variables
data = []

def make_data():
    for category in categories:
        path = os.path.join(data_dir, category)
        label = categories.index(category)

        for img_name in os.listdir(path):
            image_path = os.path.join(path, img_name)
            image = cv2.imread(image_path)

            try:
                image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
                image = cv2.resize(image, (224,224))
                image = np.array(image)

                data.append([image, label])

            except Exception as e:
                pass
    print(len(data))
    pik = open('number.pickle', 'wb')
    pickle.dump(data, pik)
    pik.close()

def load_data():
    pick = open('number.pickle', 'rb')
    data = pickle.load(pick)

    pick.close()
    feature = []
    labels = []

    for img, label in data:
        feature.append(img)
        labels.append(label)

    feature = np.array(feature, dtype = np.float32)
    labels = np.array(labels)

    return [feature, labels]

make_data()
