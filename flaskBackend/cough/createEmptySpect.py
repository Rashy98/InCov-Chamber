from flask import Flask

from scipy.io.wavfile import write,read
import librosa.display
import librosa
import matplotlib.pyplot as plt
from flaskBackend.cough.AudioRecording import audioRecorder


for i in range (0,50):

    recording = audioRecorder.recordCough()
    nameW = 'cough'+str(i)+'.wav'
    write(nameW, 44100, recording)

    cough = 'cough'+str(i)+'.wav'

    x, sr = librosa.load(cough)
    X = librosa.stft(x)
    Xdb = librosa.amplitude_to_db(abs(X))
    plt.figure(figsize=(14, 5))
    librosa.display.specshow(Xdb, sr=sr, x_axis='time', y_axis='hz')
    name = str(i)+'.png'
    plt.savefig('./../spectograms/'+name, dpi=300)
    print('----------spectogram saved--------------')
