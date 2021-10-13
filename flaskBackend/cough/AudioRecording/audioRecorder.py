"""
To record audio for cough component and Anosmia component

"""

# Importing needed libraries
import sounddevice as sd


fs = 44100  # Initialize sample rate
seconds = 4  # Initialize number of seconds to record


def recordCough():
    """
    Record audio for cough component
    :return: recording: recording containing the cough audio of 4 seconds
    """
    recording = sd.rec(int(seconds * fs), samplerate=fs, channels=1)

    sd.wait()

    return recording


def recordAnosmia():
    """
    Record audio for cough component
    :return: recording: recording containing the user response of 4 seconds
    """
    recording = sd.rec(int(5 * fs), samplerate=fs, channels=1)

    sd.wait()

    return recording
