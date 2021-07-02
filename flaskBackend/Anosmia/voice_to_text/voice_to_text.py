import speech_recognition as sr
# filename = "./../../anosmia.wav"
# initialize the recognizer
# from flaskBackend.cough.AudioRecording import audioRecorder
import numpy as np
from scipy.io.wavfile import write,read

# def recordSound():
#     recording = audioRecorder.recordAnosmia()
#     # write('anosmia.wav', 44100, recording)
#
#     y = (np.iinfo(np.int32).max * (recording / np.abs(recording).max())).astype(np.int32)
#
#     write('anosmia.wav', 44100, y)
#
#     text = voiceText('anosmia.wav')
#     print(text)
#     # return anosmiaChecker(text)
#     # return 'Recording done'
def voiceText(file):
    r = sr.Recognizer()
    # with sr.Microphone() as source:
    # # read the audio data from the default microphone
    #     audio_data = r.record(source, duration=5)
    #     print("Recognizing...")
    # # convert speech to text
    #     text = r.recognize_google(audio_data)
    #     return (text)
    # open the file
    with sr.AudioFile(file) as source:
        # listen for the data (load audio to memory)
        r.adjust_for_ambient_noise(source)
        audio_data = r.record(source)
        # recognize (convert from speech to text)
        text = r.recognize_google(audio_data)
        print(text)
    return text
# voiceText()
def Frag():
    print("Def ekk dammaaaaaaaa")
    Mw = sr.Recognizer()
    with sr.Microphone() as source:
    # read the audio data from the default microphone
        audio_data = Mw.record(source, duration=5)
        print("Recognizing...")
    # convert speech to text
        text = Mw.recognize_google(audio_data)
        # text = "oh nooooo"
    return text
# voiceText('anosmia.wav')
# Frag()
# recordSound()
# Frag()