from util_detect import load_data
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
import tensorflow as tf
import numpy as np
from sklearn.metrics import classification_report




feature, label = load_data()
x_train, x_test, y_train, y_test = train_test_split(feature, label, test_size=0.2)


categories = ['coughing','non-cough']

model = tf.keras.models.load_model('myVggCoughDetectionModel.h5')
prediction = model(x_test)

prediction_array = []
y_test_array = []

for i in range(len(x_test)):
    y_test_array.append(categories[y_test[i]])
    prediction_array.append(categories[np.argmax(prediction[i])])

print(classification_report(y_test_array, prediction_array))
# prediction = model(x_test[0:9])
#
# plt.figure(figsize=(8,8))
#
# for i in range(9):
#     plt.subplot(3,3,i+1)
#     plt.imshow(x_test[i])
#     plt.xlabel('Pedicted:%s\n Actual: %s'%(categories[np.argmax(prediction[i])],
#                                            categories[y_test[i]]))
#
#     plt.xticks([])
#
# plt.show()
