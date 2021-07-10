import sounddevice as sd
from scipy.io.wavfile import write

fs = 44100
seconds = 4

def recordCough():
    print('-------------------recording-----------------')
    recording = sd.rec(int(seconds * fs), samplerate=fs, channels=1)
    sd.wait()
    print('-------------------done----------------------')
    return recording
    # write('./../../cough.wav', fs, recording)

def recordAnosmia():
    print('-------------------recording-----------------')
    recording = sd.rec(int(5 * fs), samplerate=fs, channels=1)
    sd.wait()
    print('-------------------done----------------------')
    return recording

