import speech_recognition as sr
filename = "aud.wav"
# initialize the recognizer

def voiceText():
    r = sr.Recognizer()

    with sr.Microphone() as source:
    # read the audio data from the default microphone
        audio_data = r.record(source, duration=5)
        print("Recognizing...")
    # convert speech to text
        text = r.recognize_google(audio_data)
        return (text)