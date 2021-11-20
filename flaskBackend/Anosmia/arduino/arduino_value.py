"""
    all methods for get sensor reading values
"""

# Importing needed libraries
import serial


def getSensorValue():
    """
        Method to make the connection and to get the value from the arduino board
        :return: decoded_values
    """
    arduino = serial.Serial('COM5', 115200)
    print('Established serial connection to Arduino')
    arduino_data = arduino.readline()

    decoded_values = str(arduino_data[0:len(arduino_data)].decode("utf-8"))

    return decoded_values