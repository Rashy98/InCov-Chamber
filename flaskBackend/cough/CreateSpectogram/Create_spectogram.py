"""
To create spectrogram from the given audio file
"""

# Importing needed libraries
import librosa.display
import librosa
import matplotlib.pyplot as plt

# initializing the saving path to the spectrogram
spectrogram_save_path = './spectograms/spectogram.png'


def createWavelets(cough):
    """
    Method to create the spectrogram from the audio for the cough component
    :param cough:
    :return: 'created' : return 'created' when the spectrogram is created and saved
    """
    x, sr = librosa.load(cough)
    xl = librosa.stft(x)
    xdb = librosa.amplitude_to_db(abs(xl))
    plt.figure(figsize=(14, 5))
    librosa.display.specshow(xdb, sr=sr, x_axis='time', y_axis='hz')
    plt.savefig(spectrogram_save_path, dpi=300)

    return 'created'

