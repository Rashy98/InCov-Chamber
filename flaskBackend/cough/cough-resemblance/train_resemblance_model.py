"""
To train the cough resemblance model - VGG16
"""

# Importing needed libraries
from tensorflow.python.keras.models import Sequential
from util_res import load_data
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
import tensorflow as tf
from keras.applications.vgg16 import VGG16
from keras.layers import Dense, Dropout, Flatten, Input
from keras.models import Model

# Load data needed for the model training from the util file
feature, label = load_data()

# Define categories
categories = ['healthy', 'positive']

# Split the dataset into training and validation sets
x_train, x_test, y_train, y_test = train_test_split(feature, label, test_size=0.2, shuffle=True)

# Cast both training and testing features into float
x_train, x_test = tf.cast(x_train, tf.float32), tf.cast(x_test, tf.float32)

# Create training dataset
train_dataset = tf.data.Dataset.from_tensor_slices((x_train, y_train))
train_dataset = train_dataset.batch(batch_size=1)

# Initiate input shape for the model
input_tensor = Input(shape=(224, 224, 3))

# Calling the pre-trained model VGG16 and altering the layers
base_model = VGG16(weights='imagenet', include_top=False, input_tensor=input_tensor)
top_model = Sequential()
top_model.add(Flatten(input_shape=base_model.output_shape[1:]))

# Activating all convolution layers using the Rectified Linear Unit (RELU)
top_model.add(Dense(256, activation='relu'))
top_model.add(Dropout(0.5))
top_model.add(Dense(2, activation='softmax'))

# Getting the altered model into a variable
model = Model(inputs=base_model.input, outputs=top_model(base_model.output))

# Setting the loss function to Binary Cross entropy
loss_object = tf.keras.losses.BinaryCrossentropy()

# Initializing the optimizer to Adam
optimizer = tf.keras.optimizers.Adam()

train_loss = tf.keras.metrics.Mean(name='train_loss')
train_accuracy = tf.keras.metrics.SparseCategoricalAccuracy(name='train_accuracy')


@tf.function
def train_step(features, resemblance_labels):
    """
    Training the model
    :param features: training spectrogram
    :param resemblance_labels: labels of the training dataset
    """
    with tf.GradientTape() as tape:
        predictions = model(features, training=True)
        loss = loss_object(y_true=resemblance_labels, y_pred=predictions)

    gradients = tape.gradient(loss, model.trainable_variables)
    optimizer.apply_gradients(grads_and_vars=zip(gradients, model.trainable_variables))
    train_loss(loss)
    train_accuracy(resemblance_labels, predictions)


for epoch in range(40):

    train_loss.reset_states()  # Resetting the state of the training loss for each epoch
    train_accuracy.reset_states()   # Resetting the state of the training accuracy for each epoch

    step = 0

    for images, labels in train_dataset:  # Looping through the training dataset
        step += 1
        train_step(images, labels)  # calling the train_step method

        if step % 10 == 0:
            print('=> epoch: %i, loss: %.4f, train_accuracy: %.4f' % (epoch + 1,

                                                                      train_loss.result(), train_accuracy.result()))
# Saving the trained model
model.save('myVggCoughResModel.h5')
