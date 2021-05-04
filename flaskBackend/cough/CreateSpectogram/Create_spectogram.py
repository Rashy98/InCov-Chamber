import numpy as np
from scipy.io import wavfile
from sklearn.preprocessing import scale
import librosa.display
import librosa
import matplotlib.pyplot as plt
import os



def createWavelets(cough):

    x , sr = librosa.load(cough)
    X = librosa.stft(x)
    Xdb = librosa.amplitude_to_db(abs(X))
    plt.figure(figsize=(14, 5))
    librosa.display.specshow(Xdb, sr=sr, x_axis='time', y_axis='hz')

    plt.savefig( './spectograms/spectogram.png', dpi = 300)
    print('----------spectogram saved--------------')

# createWavelets()
# createWavelets('')
