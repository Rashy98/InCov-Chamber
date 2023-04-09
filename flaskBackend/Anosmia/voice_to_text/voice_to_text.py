"""
    All methods to convert voice to text
"""
# Importing the needed library
import speech_recognition as sr


def voiceText(AudioRecording):
    """
        Method to convert audio response to text to Yes/No classification
        :param AudioRecording: Recorded audio of the user response
        :return: text : Converted text for Yes/No Classification
    """

    recognition = sr.Recognizer()

    with sr.AudioFile(AudioRecording) as source:

        # listen for the data (load audio to memory)
        recognition.adjust_for_ambient_noise(source)
        audio_data = recognition.record(source)

        # recognize (convert from speech to text)
        text = recognition.recognize_google(audio_data)
        print(text)
    return text


def Frag():
    """
        Method to convert audio response to text to fragrance type classification
        :return: text : Converted text for fragrance type Classification
    """
    FragRecognizer = sr.Recognizer()
    with sr.Microphone() as source:

    # read the audio data from the default microphone
        audio_data = FragRecognizer.record(source, duration=5)
        print("Recognizing...")

    # convert speech to text
        text = FragRecognizer.recognize_google(audio_data)

    return text
