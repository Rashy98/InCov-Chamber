/*
    Dashboard displaying all results.
*/

// importing needed libraries
import React, {Component} from "react";
import FlipCard from "./flipCard";
import {motion} from 'framer-motion';
import {withRouter} from "react-router-dom";
import axios from "axios";


// importing assets
import '../App.css';
import "../assets/scss/black-dashboard-react.scss";
import "../assets/css/nucleo-icons.css";
import Logo from "../assets/Images/logo3.png";
import welcome_audio from './../sound/welcome.wav';
import anosmia01 from './../sound/anosmia01.wav';
import anosmia02 from './../sound/anosmia02.wav';
import ask_to_cough from './../sound/ask_to_cough.wav';
import no_cough_audio from './../sound/NonCough.wav';


import {
    Card,
    CardHeader,
    CardBody,
    Row,
    Col,
    CardText,
}
from "reactstrap";


class MainDashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {

            // State values for the Anosmia Detection component
            anosmia_classifier_value: '',
            anosmiaStatus: '',
            anosmiaLoaded: false,
            anosmiaDisplayed: false,

            // State values for the Shortness of Breath Detection component
            breathStatus: 0,
            breathCountLoaded: false,
            breathCountDisplayed: false,

            // State values for the Cough Analysis component
            coughStatus: '',
            coughLoaded: false,
            coughDisplayed: false,
            recordingStatus: '',
            predictPercentage: 0,

            // State values for the High body temperature Detection component
            temperatureStatus: 0,
            temperatureStatusLoaded: false,
            temperatureStatusDisplayed: false,

            // State values used by both High body temperature Detection and Shortness of Breath Detection components
            thermalModuleLoaded: false,

            // State values for the Heart rate Detection component
            heartRate: 0,
            heartRateDisplayed: false,
            heartRateLoaded: false,

            isSafe: false
        }

        this.soundCommand = this.soundCommand.bind(this)
        this.AnosmiaGetData = this.AnosmiaGetData.bind(this)
        this.PlayCoughSaying = this.PlayCoughSaying.bind(this)
        this.getCoughPrediction = this.getCoughPrediction.bind(this)
        this.AnosmiaGetData = this.AnosmiaGetData.bind(this)
        this.CoughRecording = this.CoughRecording.bind(this)
        this.soundCommand = this.soundCommand.bind(this)
        this.playAudio = this.playAudio.bind(this)
        this.thermal_module = this.thermal_module.bind(this)
        this.get_temperatureStatus = this.get_temperatureStatus.bind(this)
        this.get_breathStatus = this.get_breathStatus.bind(this)
        this.displayFlipCard = this.displayFlipCard.bind(this)
        this.setDisplayState = this.setDisplayState.bind(this)
        this.handleAudio = this.handleAudio.bind(this)
        this.get_heartRate = this.get_heartRate.bind(this)
        this.saveToDB = this.saveToDB.bind(this)
    }


    async componentDidMount() {

        await this.handleAudio(welcome_audio)
        this.soundCommand()
        this.thermal_module()
        this.get_heartRate()

    }


    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.temperatureStatusDisplayed !== this.state.temperatureStatusDisplayed) {

            this.saveToDB()

            if ((this.state.anosmiaStatus === "Normal") &&
                (this.state.coughStatus === "Normal") &&
                (parseFloat(this.state.temperatureStatus) <= 38) &&
                (this.state.breathStatus === "Normal")) {
                // _isSafe = true
                this.props.history.push({
                    pathname: '/FinalPage',
                    state: {isSafe: true}
                })
            } else {
                this.props.history.push({
                    pathname: '/FinalPage',
                    state: {isSafe: false}
                })
            }
        }
    }

    // Plays the audio instruction for the Anosmia component
    soundCommand() {
        setTimeout(this.AnosmiaGetData, 8000);
    }


    async handleAudio(audio) {
        this.audio = new Audio(audio)
        this.audio.load()
        this.playAudio()
    }


    // Plays the welcoming audio
    playAudio() {
        const audioPromise = this.audio.play()
        if (audioPromise !== undefined) {
            audioPromise
                .then(_ => {
                    // autoplay started
                })
                .catch(err => {
                    // catch dom exception
                    console.info(err)
                })
        }
    }


    // Performs Anosmia component's processes
    async AnosmiaGetData() {
        await this.handleAudio(anosmia01)

        setTimeout(fetch('/anosmia', {
            method: 'GET',
        }).then((response) => {
            response.json().then((body) => {

                if (body.classifier_value === '') {
                    this.soundCommand()
                } else {

                    this.setState({
                        anosmia_classifier_value: body.classifier_value,
                    })

                    if (body.classifier_value === 'yes') {
                        // setTimeout(this.getAnosmiaFragrance(), 2000)
                        this.getAnosmiaFragrance()
                    } else {

                        var arduino_val = body.arduino_value

                        if (arduino_val > 1500) {
                            this.setState({
                                anosmiaStatus: 'Unusual'
                            })
                        } else {
                            this.setState({
                                anosmiaStatus: 'Normal'
                            })
                        }

                        this.setState({
                            anosmiaLoaded: true,
                            anosmiaDisplayed: true
                        })

                        this.PlayCoughSaying('init')
                    }

                }
            });

        }), 1200)


    }

    // Performs Anosmia component's processes
    getAnosmiaFragrance() {
        this.handleAudio(anosmia02)

        fetch('/anosmiaFrag', {
            method: 'POST',
        }).then((response) => {
            response.json().then((body) => {
                var status = ''

                if (body.status === 'LIAR') {
                    status = "Unusual"
                } else {
                    status = "Normal"
                }

                this.setState({
                    anosmiaStatus: status,
                    anosmiaLoaded: true,
                    anosmiaDisplayed: true
                })

                this.PlayCoughSaying('init')
            });
        });
    }

    // Plays the audio instruction for the Cough analysis component
    PlayCoughSaying(position) {
        if (position === 'init') {
            this.handleAudio(ask_to_cough)

        } else {
            this.handleAudio(no_cough_audio)
        }
        setTimeout(this.CoughRecording, 4200);
    }


    // Records cough audio
    CoughRecording() {
        fetch('/recordCough', {
            method: 'GET',
        }).then((response) => {
            response.json().then((body) => {
                console.log(body)
                this.setState({
                    recordingStatus: body
                })
            });
        });

        setTimeout(this.getCoughPrediction, 8000)
    }


    //  Gets the shortness of breath and temperature values
    thermal_module() {
        fetch('thermal_module', {
            method: 'GET'
        }).then((response) => {
            response.json().then((body) => {

                var breathStatus = ''
                var breathCount = body.breath_count * 2
                var temperatureStatus = body.temperature

                if (12 <= breathCount && breathCount <= 20) {
                    breathStatus = 'Normal'
                } else {
                    breathStatus = 'Unusual'
                }

                this.setState({
                    temperatureStatus: temperatureStatus + "\u00b0 C",
                    breathStatus: breathStatus,
                    thermalModuleLoaded: true
                })
            })
        })
    }

    // Determine the temperature status - temperature
    get_temperatureStatus() {
        fetch('get_temperatureStatus', {
            method: 'GET'
        }).then((response) => {
            response.json().then((body) => {
                this.setState({
                    temperatureStatus: body.temperatureStatus + "\u00b0 C"
                })
            })
        })
    }

    // Determine the shortness of breath status - breath count
    get_breathStatus() {
        fetch('get_breathStatus', {
            method: 'GET'
        }).then((response) => {
            response.json().then((body) => {

                var breathStatus = ''

                if (12 <= (body.breathStatus * 2) <= 20) {
                    breathStatus = 'Normal'
                } else {
                    breathStatus = 'Unusual'
                }

            })
        })
    }

    // Retrieve heart rate from the database according to the user inside the chamber
    get_heartRate() {
        axios({
            method: 'post',
            url: "https://incovbackend.herokuapp.com/employee/getHeartRate",
            headers: {},
            data: {
                empID: this.props.location.state.employee.empID
            }
        }).then(res => {
            this.setState({
                heartRate: res.data.heartRate,
                heartRateLoaded: true
            })

            this.setDisplayState("heartRateDisplayed", null, 1500, null)
        });
    }


    // Determine the cough component's status after analysing the audio - Usual/ Non-Usual
    getCoughPrediction() {
        let value = '';
        fetch('/predictCough', {
            method: 'GET',

        }).then((response) => {
            response.json().then((body) => {

                var coughStatus = ''

                if (body.prediction_label === 'healthy') {
                    coughStatus = 'Normal'
                } else if (body.prediction_label === 'no cough') {
                    this.PlayCoughSaying('no_cough')
                    return
                } else {
                    coughStatus = 'Unusual'
                }

                this.setState({
                    coughStatus: coughStatus,
                    predictPercentage: parseFloat(body.percentage) * 100 + " %",
                    coughLoaded: true
                })

                this.setDisplayState("coughDisplayed", "breathCountLoaded", 4000, 8000)
                this.setDisplayState("breathCountDisplayed", "temperatureStatusLoaded", 10000, 12000)
                this.setDisplayState("temperatureStatusDisplayed", null, 14000, null)

            });
        });
    }

    // Flipping cards for each symptom
    displayFlipCard(condition1, condition2, compName, compValue) {
        if (condition1) {
            if (condition2) {
                return (
                    <FlipCard componentName={compName} currentStatus="Yet to Begin"
                              componentValue={compValue} flipped={true}/>
                )
            } else {
                return (
                    <FlipCard componentName={compName} currentStatus="Yet to Begin"
                              componentValue={compValue} flipped={false}/>
                )
            }
        } else {
            return ("")
        }

    }

     // Display status
    setDisplayState(state1, state2, timeOut1, timeOut2) {
        setTimeout(function () {
                this.setState({
                    [state1]: true
                })
            }.bind(this),
            timeOut1
        )

        if (state2 !== null) {
            setTimeout(function () {
                    this.setState({
                        [state2]: true
                    })
                }.bind(this),
                timeOut2
            )
        }

    }

     // Send final results to the database
    saveToDB() {

        let date = new Date()
        let _today = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()
        let _time = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()

        axios({
            method: 'post',
            url: "https://incovbackend.herokuapp.com/employee/pushDailyReadings",
            headers: {},
            data: {
                empID : this.props.location.state.employee.empID,
                dailyReadings: {
                    cough: this.state.coughStatus,
                    anosmia: this.state.anosmiaStatus,
                    fever: this.state.temperatureStatus,
                    sob: this.state.breathStatus,
                    date: _today,
                    time: _time
                }
            }
        })
    }


    // Rendering method
    render() {
        return (
            <div className="App" style={{marginBottom: "-3%"}}>
                <Row>
                    <Col xs="12">
                        <Card className="card-chart">
                            <CardHeader>
                                <Row style={{marginLeft: '10%'}}>
                                    <Col sm={4} style={{marginTop: '7.5%'}}>
                                        <Card
                                            className="card-user"
                                            style={{height: "70%", backgroundColor: "white", boxShadow: "5px 5px 5px 5px rgba(0,173,131,.6)"}}>
                                            <CardBody style={{height: "70%"}}>
                                                <CardText/>
                                                <div className=""
                                                     style={{justifyContent: 'center', alignItems: 'center'}}>
                                                    <Row>
                                                        <img
                                                            src={Logo}
                                                            style={{width: "18em", height: "9em", marginLeft: "20%"}}
                                                        />
                                                    </Row>
                                                    <Row>
                                                        <a href="#pablo"
                                                           onClick={(e) => e.preventDefault()}
                                                           style={{marginLeft: "23%", marginTop: "-15%"}}>

                                                            {/*Displays the photo of the user inside the chamber*/}

                                                            <img
                                                                alt="..."
                                                                className="avatar"
                                                                src={`data:image/jpeg;base64,${this.props.location.state.employee.photo}`}
                                                                style={{
                                                                    marginLeft: "0em",
                                                                    marginBottom : "20%",
                                                                    width: "16em",
                                                                    height: "16em"
                                                                }}
                                                            />
                                                             {/*Displays the details of the user inside the chamber*/}
                                                            <h2 className="title" style={{marginBottom: "2%",
                                                                color : "#00aa86"}}>{this.props.location.state.employee.fullName}</h2>
                                                            <h2 className="description"
                                                                style={{color : "black"}}>{this.props.location.state.employee.position}</h2>
                                                        </a>

                                                    </Row>
                                                </div>

                                            </CardBody>

                                        </Card>
                                    </Col>
                                    <Col sm={8}>
                                        <Col lg="2.9">
                                            <motion.div
                                                initial={{scaleY: 0}}
                                                animate={{scaleY: 1}}
                                                transition={{duration: 0.5}}
                                            >
                                                {this.displayFlipCard(true, this.state.heartRateLoaded, "Heart Rate", this.state.heartRate)}
                                            </motion.div>
                                        </Col>
                                        <Col lg="2.9">
                                            <motion.div
                                                initial={{scaleY: 0}}
                                                animate={{scaleY: 1}}
                                                transition={{duration: 0.5}}
                                            >
                                                {this.displayFlipCard(this.state.heartRateDisplayed,
                                                    this.state.anosmiaLoaded, "Smell Level",
                                                    this.state.anosmiaStatus)}

                                            </motion.div>
                                        </Col>

                                        <Col lg="2.9">
                                            <motion.div
                                                initial={{scaleY: 0}}
                                                animate={{scaleY: 1}}
                                                transition={{duration: 0.5}}
                                            >
                                                {this.displayFlipCard(this.state.anosmiaDisplayed,
                                                    this.state.coughLoaded, "Cough", this.state.coughStatus)}

                                            </motion.div>

                                        </Col>
                                        {/*</Row>*/}
                                        <Col lg="2.9">
                                            <motion.div
                                                initial={{scaleY: 0}}
                                                animate={{scaleY: 1}}
                                                transition={{duration: 0.5}}
                                            >
                                                {this.displayFlipCard(this.state.coughDisplayed,
                                                    this.state.breathCountLoaded, "Breath Count",
                                                    this.state.breathStatus)}


                                            </motion.div>
                                        </Col>
                                        <Col lg="2.9">
                                            <motion.div
                                                initial={{scaleY: 0}}
                                                animate={{scaleY: 1}}
                                                transition={{duration: 0.5}}
                                            >
                                                {this.displayFlipCard(this.state.breathCountDisplayed,
                                                    this.state.temperatureStatusLoaded, "Temperature",
                                                    this.state.temperatureStatus)}

                                            </motion.div>
                                        </Col>
                                    </Col>
                                </Row>

                            </CardHeader>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
};

export default withRouter(MainDashboard);


