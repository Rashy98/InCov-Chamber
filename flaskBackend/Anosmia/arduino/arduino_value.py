import serial
import time
import schedule

def getSensorValue():
    arduino = serial.Serial('com3', 115200)
    print('Established serial connection to Arduino')
    arduino_data = arduino.readline()

    decoded_values = str(arduino_data[0:len(arduino_data)].decode("utf-8"))

    # print(f'Collected readings from Arduino: {decoded_values}')
    # arduino_data = 0
    # arduino.close()
    # print('Connection closed')
    # print('<----------------------------->')
    return decoded_values


# ----------------------------------------Main Code------------------------------------
# Declare variables to be used
# list_values = []
# list_in_floats = []
#
# print('Program started')
#
# # Setting up the Arduino
# schedule.every(10).seconds.do(getSensorValue)
#
# while True:
#     schedule.run_pending()
#     time.sleep(1)

# ----------------------------------------New Code------------------------------------
# try:
#     arduino = serial.Serial("COM3", timeout= 1)
# except:
#     print("Please check the port")
#
# rawdata = []
# count = 0
#
# while count < 3:
#     rawdata.append(str(arduino.readline()))
#     count += 1
# print(rawdata)