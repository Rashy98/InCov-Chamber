"""
    Train the voice recognition model
"""

# Importing needed libraries
import os
import pandas as pd
import librosa
import matplotlib.pyplot as plt
import numpy as np
import tensorflow as tf
from keras.utils.np_utils import to_categorical
from sklearn.preprocessing import StandardScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout
from keras.callbacks import EarlyStopping
from sklearn.preprocessing import LabelEncoder


# Read data from the csv to a dataframe
df = pd.read_csv('speaker_dataset.csv')
df = df.sample(frac=1).reset_index(drop=True)

# Break the dataset into train and test sets
df_train = df[:200]
df_test = df[201:]


def extract_features(files):

    """
        Extracts the labels and features needed for the model training
        :param files: File containing the dataset
        :return: mfccs, chroma, mel, contrast, tonnetz, label: All the features and labels of the dataset needed
                for model training
    """

    file_name = os.path.join('./Data/'+str(files.speaker)+'/' + str(files.file))

    X, sample_rate = librosa.load(file_name, res_type='kaiser_fast')

    mfccs = np.mean(librosa.feature.mfcc(y=X, sr=sample_rate, n_mfcc=40).T, axis=0)

    stft = np.abs(librosa.stft(X))

    chroma = np.mean(librosa.feature.chroma_stft(S=stft, sr=sample_rate).T, axis=0)

    mel = np.mean(librosa.feature.melspectrogram(X, sr=sample_rate).T, axis=0)

    contrast = np.mean(librosa.feature.spectral_contrast(S=stft, sr=sample_rate).T, axis=0)

    tonnetz = np.mean(librosa.feature.tonnetz(y=librosa.effects.harmonic(X),
                                              sr=sample_rate).T, axis=0)

    label = files.speaker

    return mfccs, chroma, mel, contrast, tonnetz, label


features_label = df.apply(extract_features, axis=1)
features = []
print(features_label)

for i in range(0, len(features_label)):
    features.append(np.concatenate((features_label[i][0], features_label[i][1],
                features_label[i][2], features_label[i][3],
                features_label[i][4]), axis=0))

print(df['speaker'].nunique())

speaker = []

for i in range(0, len(df)):

    speaker.append(df['speaker'][i])

X = np.array(features, dtype=np.float)

labels = speaker
np.unique(labels, return_counts=True)

y = np.array(labels)


# Hot encoding y
lb = LabelEncoder()
y = to_categorical(lb.fit_transform(y))


X_train = X[:200]
y_train = y[:200]

X_test = X[201:]
y_test = y[201:]

ss = StandardScaler()
X_train = ss.fit_transform(X_train)
X_test = ss.transform(X_test)


model = Sequential()

model.add(Dense(193, input_shape=(193,), activation = 'relu'))
model.add(Dropout(0.1))

model.add(Dense(128, activation = 'relu'))
model.add(Dropout(0.25))

model.add(Dense(128, activation = 'relu'))
model.add(Dropout(0.5))

model.add(Dense(115, activation = 'softmax'))
model.add(Dense(10, activation='sigmoid'))

model.compile(loss='categorical_crossentropy', metrics=['accuracy'], optimizer='adam')

early_stop = EarlyStopping(monitor='val_loss', min_delta=0, patience=100, verbose=1, mode='auto')


history = model.fit(X_train, tf.convert_to_tensor(y_train), batch_size=256,
                    epochs=100,
                    validation_data=(X_test, tf.convert_to_tensor(y_test)),
                    callbacks=[early_stop])

model.save('voice_classifier.h5')

preds = model.predict_classes(X_test)
preds = lb.inverse_transform(preds)
df_test = df[201:]
df_test['preds'] = preds
print(df_test)

plt.plot(history.history['accuracy'])
plt.plot(history.history['val_accuracy'])
plt.title('model accuracy')
plt.ylabel('accuracy')
plt.xlabel('epoch')
plt.legend(['train', 'test'], loc='upper left')
plt.show()

plt.plot(history.history['loss'])
plt.plot(history.history['val_loss'])
plt.title('model loss')
plt.ylabel('loss')
plt.xlabel('epoch')
plt.legend(['train', 'test'], loc='upper left')
plt.show()
