import pickle

import cv2
import os
from sklearn.neighbors import KNeighborsClassifier
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import classification_report
import numpy as np

# load images from file
data_dir = './Data/'

# initialize variables
X = []
y = []

categories = ["0","1","2","3","4","5","6","7","8","9"]

#
for label in categories:
    print(label)
    file_list = os.listdir(data_dir + label)
    for file_name in file_list:
        img_path = data_dir + label + '/' + file_name
        img = cv2.imread(img_path)

        img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        x = cv2.resize(img, (224, 224))
        X.append(x)
        y.append(label)

X = np.array(X)
y = np.array(y)

print(X.shape)
print(y.shape)

# split the labled dataset into training / test sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=10)
print(X_train.shape)

# train using K-NN
model = KNeighborsClassifier(n_neighbors=1)
model.fit(X_train.reshape(2862, -1), y_train)
print(model.score(X_test.reshape(716, -1), y_test))

y_pred = model.predict(X_test.reshape(716, -1))


knnPickle = open('number_classifier_model', 'wb')

# print classification report
pickle.dump(model, knnPickle)
print(classification_report(y_test, y_pred))


