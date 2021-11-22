"""
    To test the cough resemblance model
"""

# Importing the needed libraries
from util_res import load_data
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
import tensorflow as tf
import numpy as np
from sklearn.metrics import classification_report

# Load data needed for the model training from the util file
feature, label = load_data()

# Split the dataset into training and validation sets
x_train, x_test, y_train, y_test = train_test_split(feature, label, test_size=0.2, shuffle=True)

# Define categories
categories = ['healthy', 'positive']

# Calling the trained model
resemblance_model = tf.keras.models.load_model('myVggCoughResModel.h5')

# Make predictions for the testing dataset with the trained model
prediction = resemblance_model.predict(x_test)


def get_classification_report():
    """
        Prints the classification report
    """
    prediction_array = []
    y_test_array = []

    for classification in range(len(x_test)):
        y_test_array.append(categories[y_test[classification]])
        prediction_array.append(categories[np.argmax(prediction[classification])])

    print(classification_report(y_test_array, prediction_array))  # Printing the classification report


def plot_ten_predictions():
    """
        Plotting predicted and actual labels for ten spectrogram
    """
    # predict the first ten spectrograms from the testing dataset
    prediction_resemblance = resemblance_model(x_test[0:9])

    plt.figure(figsize=(8, 8))

    for i in range(9):
        plt.subplot(3, 3, i + 1)
        plt.imshow(x_test[i])
        plt.xlabel(
            'Pedicted:%s\n Actual: %s' % (categories[np.argmax(prediction_resemblance[i])], categories[y_test[i]]))

        plt.xticks([])

    plt.show()


get_classification_report()
plot_ten_predictions()
