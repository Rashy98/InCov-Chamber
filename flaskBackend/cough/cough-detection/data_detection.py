"""
To test the cough detection model
"""

# Importing the needed libraries
from util_detect import load_data
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
import tensorflow as tf
import numpy as np
from sklearn.metrics import classification_report

# Load data needed for the model training from the util file
feature, label = load_data()

# Split the dataset into training and validation sets
x_train, x_test, y_train, y_test = train_test_split(feature, label, test_size=0.2)

# Define categories
categories = ['coughing', 'non-cough']

# Calling the trained model
detection_model = tf.keras.models.load_model('myVggCoughDetectionModel.h5')


def get_classification_report_cough_detection():
    """
        Prints the classification report
    """

    # Make predictions for the testing dataset with the trained model
    detection_prediction = detection_model(x_test)
    prediction_array = []
    y_test_array = []

    for i in range(len(x_test)):
        y_test_array.append(categories[y_test[i]])
        prediction_array.append(categories[np.argmax(detection_prediction[i])])

    # Obtain the classification report
    print(classification_report(y_test_array, prediction_array))


def plot_spectrogram_for_testing():
    """
    Make predictions for the testing dataset with the trained model for the 1st 10 spectrogram to
    plot the classifications
    """

    prediction = detection_model(x_test[0:9])
    plt.figure(figsize=(8, 8))

    for i in range(9):
        plt.subplot(3, 3, i + 1)
        plt.imshow(x_test[i])
        plt.xlabel('Pedicted:%s\n Actual: %s' % (categories[np.argmax(prediction[i])],
                                                 categories[y_test[i]]))

        plt.xticks([])

    plt.show()


get_classification_report_cough_detection()
plot_spectrogram_for_testing()
