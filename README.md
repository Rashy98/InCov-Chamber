# 2021-045

### Main Objective:

To construct an intelligent chamber which is more efficient and precise than the existing method of checking only the body temperature used in identifying potential Covid-19 suspects at the entrance of a considered organization, by evaluating the symptoms; fever, cough, anosmia and shortness of breath. 


### Main Research Questions :

COVID-19, the global pandemic which was first identified in December 2019 in the city of Wuhan, China [1], has a huge negative impact on the daily activities related to almost every aspect of human life. At the same time, due to the spread of the disease within the organizations around the world, the daily functioning of these are interrupted, while even causing the closure of some of these organizations which affects negative growth of the global economy [2][3].
With this concern, it is needed to identify the people who are prone to have a possibility of having COVID-19 before that person enters the organizational premises and being contacted with the other employees of this organization. To date, body temperature is the only aspect that is considered in the process of identifying potential Covid-19 suspects when entering an organization. However, there can be infected people having cough or other common symptoms without any indications of fever [4], which might lead to have an infected person entering the organization. In such situations, absence of a smart system to distinguish possible suspects by considering symptoms other than fever, may bring about putting a whole organization at risk.
Hence the problem, “How to detect possible COVID-19 suspects more efficiently without only considering fever, but by considering fever along with some other common symptoms before accessing the premises of an organization?” is to be addressed in this research using a smart automated system. 


### Individual Research Questions:

**Member 01:** 

Identifying the person inside the chamber and maintain a daily record of their data
Identifying people with high body temperature

**Member 02 :** 

Identifying people with anosmia; the loss of smell

**Member 03 :** 

Identifying the resemblance of a cough and a cough of a Covid-19 positive patient.

**Member 04 :** 

Identifying people with shortness of breath; difficulty in breathing


### Individual Objectives :

**Member 01:** 

* Identifying the person/employee inside the chamber and retrieving the persons details.
Two techniques are used for this purpose,
1.	When the person enters the chamber, the face is recognized to extract the user details using a camera and through image processing with the use of a neural network.
2.	In case the person is not identified through facial recognition, voice recognition is used to recognize the person using Audio processing with a Convention Neural Network.
•	Identifying people with high body temperature.

* Identifying individuals with high body temperature (higher than 37o Celsius) by using a thermal camera. The real-time thermal footage is fed to a trained model and the temperature is obtained in a numerical form. The model is trained by providing different thermal videos of people along with their respective body temperatures. 


**Member 02 :** 

* Identifying people with anosmia; the loss of smell, using voice to text and audio processing according to a verbal response

1. Identify the people who possess the inability to recognize the smell (Anosmia) with the use of verbal responses received to a set of questions based on the smell inside the chamber from the person. 

2. The audio is converted into text using a voice to text technique and the response is used as the input for an algorithm that compares it with a value that is obtained from a sensor which detects the concentration of a chemical. (Scent that is available inside the chamber)


**Member 03 :** 

* Classifying people with forced coughs that are more similar to the forced cough of Covid-19 patients using an Artificial Neural Network and audio processing.

1. Compare forced cough of the person (recorded using a microphone), with a trained model containing forced coughs of COVID-19 patients and healthy persons. The audio will be analyzed using audio processing techniques and an Artificial Neural Network will be used to obtain a percentage of how much the forced cough is similar to the forced-cough of a COVID-19 patient.

2. The required dataset to train the model will be collected from the project ‘Coswara’ by IISc Bangalore.


**Member 04 :** 

* Identifying people with shortness of breath.
1. Analyzing the respiratory rate of the person. The person will ask to breathe ordinarily. The breathing pattern will be recorded by the aid of the thermal cameral. Next, the video will be further analyzed using video processing techniques to calculate the respiratory rate.

2. 	A respiratory cycle will be identified by the thermal color difference in the nostril area at exhalation of breath.

3. The count of color changes will be taken at the end of sixty seconds. The result will be compared with the respiratory rate of a healthy person. (12-16 seconds) 




