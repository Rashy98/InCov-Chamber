import pandas as pd
import tensorflow as tf

from voice_train_model import X_test

df = pd.read_csv('speaker_dataset.csv')
df = df.sample(frac=1).reset_index(drop=True)
df_test = df[201:]

model = tf.keras.models.load_model('voice_classifier.h5')

preds = model.predict_classes(X_test)
