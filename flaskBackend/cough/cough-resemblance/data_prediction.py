from util_res import load_data
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
import tensorflow as tf
import numpy as np
from sklearn.metrics import classification_report, confusion_matrix



feature, label = load_data()
x_train, x_test, y_train, y_test = train_test_split(feature, label, test_size=0.2)


categories = ['healthy','positive']

model = tf.keras.models.load_model('myVggCoughResModel.h5')

# prediction = model.predict(x_test, batch_size=32)
# print(classification_report(y_test.argmax(axis=1),prediction.argmax(axis=1), target_names=categories))
predictions = model(x_test[0:9])

# print(len(x_test),len(y_test))


prediction = model.predict(x_test)

prediction_array = []
y_test_array = []

for i in range(len(x_test)):
    y_test_array.append(categories[y_test[i]])
    prediction_array.append(categories[np.argmax(prediction[i])])

# print(prediction_array)
# print(y_test_array)


print(classification_report(y_test_array, prediction_array))
# print(confusion_matrix(y_test, prediction))

plt.figure(figsize=(8,8))

for i in range(9):
    plt.subplot(3,3,i+1)
    plt.imshow(x_test[i])
    plt.xlabel('Pedicted:%s\n Actual: %s'%(categories[np.argmax(predictions[i])],
                                           categories[y_test[i]]))

    plt.xticks([])

plt.show()

