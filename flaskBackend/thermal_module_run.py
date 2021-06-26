from fever import Fever
from sob import SOB

def run_thermal_modules():

    temperature = Fever.Fever_start()
    breath_count = SOB.SOB_run()

    result = {
        'temperature': temperature,
        'breath_count': breath_count
    }

    return result

# run_thermal_modules()