"""
    To record audio for cough component and Anosmia component

"""

# Importing needed libraries
import sounddevice as sd
import logging

fs = 44100  # Initialize sample rate
seconds = 4  # Initialize number of seconds to record

# initializing log related variables
log_file_path = './logs/cough.log'
log_format = '%(asctime)s : %(levelname)s : %(funcName)s : %(lineno)d : %(message)s'

# initialize the logger
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)
file_handler = logging.FileHandler(log_file_path)
formatter = logging.Formatter(log_format)
file_handler.setFormatter(formatter)
logger.addHandler(file_handler)


def recordCough():
    """
        Record audio for cough component
        :return: recording: recording containing the cough audio of 4 seconds
    """
    recording = sd.rec(int(seconds * fs), samplerate=fs, channels=1)

    sd.wait()

    try:
        return recording
    except AttributeError:
        logger.critical("Audio not recorded.")

    return recording

def recordAnosmia():
    """
        Record audio for anosmia component
        :return: recording: recording containing the user response of 4 seconds
    """
    recording = sd.rec(int(5 * fs), samplerate=fs, channels=1)

    sd.wait()

    return recording
