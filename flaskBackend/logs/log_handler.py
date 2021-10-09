"""
    Handler module for all log files
"""

import logging

log_format = '%(asctime)s : %(levelname)s : %(message)s'
colon = ' : '


def log(logger_name, log_level, func_name, line_no, log_msg):
    """
        Generic method to handle all the logging

        :param logger_name: name of the module which invokes the logs
        :param log_level: level of the log
        :param func_name: name of the function which triggers the log
        :param line_no: line number of the function which triggers the log
        :param log_msg: log message
    """

    logging.basicConfig(level=logging.INFO, filename='logs/' + logger_name + '.log', format=log_format)

    if log_level == "DEBUG":
        logging.debug(func_name + colon + log_msg)
    elif log_level == "INFO":
        logging.info(func_name + colon + log_msg)
    elif log_level == "WARNING":
        logging.warning(func_name + colon + log_msg)
    elif log_level == "ERROR":
        logging.error(func_name + colon + str(line_no) + colon + log_msg)
    elif log_level == "CRITICAL":
        logging.critical(func_name + colon + str(line_no) + colon + log_msg)
