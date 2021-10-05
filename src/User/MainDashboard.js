import React, {Component} from "react";
import FlipCard from "./flipCard";
import {AnimatePresence, motion} from 'framer-motion';

import welcome_audio from './../sound/welcome.wav';
import anosmia01 from './../sound/anosmia01.wav';
import anosmia02 from './../sound/anosmia02.wav';
import ask_to_cough from './../sound/ask_to_cough.wav';
import thank_you_audio from './../sound/ThankYou.wav'
import cough_audio from './../sound/Cough.wav'
import no_cough_audio from './../sound/NonCough.wav'

import '../App.css';
import "../assets/scss/black-dashboard-react.scss";
import "../assets/css/nucleo-icons.css";
import Logo from "../assets/Images/logo3.png"

import {
    Button,
    ButtonGroup,
    Card,
    CardHeader,
    CardBody,
    CardTitle,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown,
    Label,
    FormGroup,
    Input,
    Table,
    Row,
    Col,
    CardFooter,
    CardText,

    Form,
    UncontrolledTooltip,
} from "reactstrap";
import {Redirect, withRouter} from "react-router-dom";
import axios from "axios";


class MainDashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            anosmia_classifier_value: '',
            recordingStatus: '',
            predictPercentage: 0,

            anosmiaStatus: '',
            coughStatus: '',
            temperatureStatus: 0,
            breathStatus: 0,
            heartRate: 0,

            thermalModuleLoaded: false,
            temperatureStatusLoaded: false,
            breathCountLoaded: false,
            coughLoaded: false,
            anosmiaLoaded: false,
            heartRateLoaded: false,

            anosmiaDisplayed: false,
            coughDisplayed: false,
            breathCountDisplayed: false,
            temperatureStatusDisplayed: false,
            heartRateDisplayed: false,

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

        // this.audio = new Audio(welcome_audio)
        // this.audio.load()
        // this.playAudio()
        // const audioEl = document.getElementsByClassName("audio-element")[0]
        // audioEl.play()
        // this.get_temperatureStatus()
        // setTimeout(function (){
        //     this.get_breathStatus()
        // }.bind(this), 2000)

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.temperatureStatusDisplayed !== this.state.temperatureStatusDisplayed) {

            // this.saveToDB()

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

    soundCommand() {
        setTimeout(this.AnosmiaGetData, 8000);
        // setTimeout(this.PlayCoughSaying, 20000);
    }

    async handleAudio(audio) {
        this.audio = new Audio(audio)
        this.audio.load()
        this.playAudio()
    }

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

    async AnosmiaGetData() {
        await this.handleAudio(anosmia01)

        // this.audio = new Audio(anosmia01)
        // this.audio.load()
        // this.playAudio()

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

    getAnosmiaFragrance() {
        this.handleAudio(anosmia02)
        // this.audio = new Audio(anosmia02)
        // this.audio.load()
        // this.playAudio()

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

                // setTimeout(this.PlayCoughSaying('init'), 4000)
                this.PlayCoughSaying('init')
            });
        });
    }

    PlayCoughSaying(position) {
        console.log('hfuvid')
        if (position === 'init') {
            this.handleAudio(ask_to_cough)
            // this.audio = new Audio(ask_to_cough)
            // this.audio.load()
            // this.playAudio()
        } else {
            this.handleAudio(no_cough_audio)
            // this.audio = new Audio(no_cough_audio)
            // this.audio.load()
            // this.playAudio()
        }

        setTimeout(this.CoughRecording, 4200);
    }

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

    get_breathStatus() {
        fetch('get_breathStatus', {
            method: 'GET'
        }).then((response) => {
            response.json().then((body) => {

                var breathStatus = ''

                if (12 <= (body.breathStatus * 2) <= 18) {
                    breathStatus = 'Normal'
                } else {
                    breathStatus = 'Unusual'
                }

                // this.setState({
                //     breathStatus: breathStatus
                // })
            })
        })
    }

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

                this.setDisplayState("coughDisplayed", "breathCountLoaded", 4000, 6000)
                this.setDisplayState("breathCountDisplayed", "temperatureStatusLoaded", 8000, 10000)
                this.setDisplayState("temperatureStatusDisplayed", null, 12000, null)

            });
        });
    }

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

    saveToDB() {

        let date = new Date()
        let _today = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()
        let _time = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()

        axios({
            method: 'post',
            url: "https://incovbackend.herokuapp.com/employee/pushDailyReadings",
            // url: "http://localhost:7000/employee/pushDailyReadings",
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

    render() {
        return (
            <div className="App" style={{marginBottom: "-3%"}}>
                <Row>
                    {/*<div>*/}
                    {/*    <audio className="audio-element">*/}
                    {/*        <source src={audio}></source>*/}
                    {/*    </audio>*/}
                    {/*</div>*/}
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
                                                        <a href="#pablo" onClick={(e) => e.preventDefault()}
                                                           style={{marginLeft: "23%", marginTop: "-15%"}}>
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
                                                            <h2 className="title" style={{marginBottom: "2%", color : "#00aa86"}}>{this.props.location.state.employee.fullName}</h2>
                                                            <h2 className="description" style={{color : "black"}}>{this.props.location.state.employee.position}</h2>
                                                        </a>

                                                    </Row>
                                                </div>

                                            </CardBody>

                                        </Card>
                                    </Col>
                                    <Col sm={8}>
                                        {/*<Row style={{ width: '90%', height: '10%', marginLeft:"5%" }}>*/}
                                        <Col lg="2.9">
                                            <motion.div
                                                initial={{scaleY: 0}}
                                                animate={{scaleY: 1}}
                                                // exit={{scaleY: 0}}
                                                transition={{duration: 0.5}}
                                            >
                                                {this.displayFlipCard(true, this.state.heartRateLoaded, "Heart Rate", this.state.heartRate)}
                                                {/*{this.state.breathCountDisplayed ?*/}
                                                {/*    <div>*/}
                                                {/*        {this.state.temperatureStatusLoaded ?*/}
                                                {/*            <FlipCard componentName="Body temperatureStatus"*/}
                                                {/*                      currentStatus="Yet to Begin"*/}
                                                {/*                      componentValue={this.state.temperatureStatus}*/}
                                                {/*                      flipped={true}/> :*/}
                                                {/*            <FlipCard componentName="Body temperatureStatus"*/}
                                                {/*                      currentStatus="Yet to Begin"*/}
                                                {/*                      componentValue="Un Normal" flipped={false}/>*/}
                                                {/*        }*/}
                                                {/*    </div>*/}
                                                {/*    : ""*/}
                                                {/*}*/}
                                            </motion.div>
                                        </Col>
                                        <Col lg="2.9">
                                            <motion.div
                                                initial={{scaleY: 0}}
                                                animate={{scaleY: 1}}
                                                // exit={{scaleY: 0}}
                                                transition={{duration: 0.5}}
                                            >
                                                {this.displayFlipCard(this.state.heartRateDisplayed, this.state.anosmiaLoaded, "Smell Level", this.state.anosmiaStatus)}
                                                {/*{this.state.anosmiaLoaded ?*/}

                                                {/*    <FlipCard componentName="Smell Level" currentStatus="Yet to Begin"*/}
                                                {/*              componentValue="Normal" flipped={true}/>*/}
                                                {/*    :*/}
                                                {/*    <FlipCard componentName="Smell Level" currentStatus="Yet to Begin"*/}
                                                {/*              componentValue="Not Normal" flipped={false}/>*/}
                                                {/*}*/}
                                            </motion.div>
                                        </Col>
                                        {/*</Row>*/}

                                        {/*<Row style={{marginLeft: "13%", marginTop: "5%"}}>*/}
                                        <Col lg="2.9">
                                            <motion.div
                                                initial={{scaleY: 0}}
                                                animate={{scaleY: 1}}
                                                // exit={{scaleY: 0}}
                                                transition={{duration: 0.5}}
                                            >
                                                {this.displayFlipCard(this.state.anosmiaDisplayed, this.state.coughLoaded, "Cough", this.state.coughStatus)}
                                                {/*{this.state.anosmiaDisplayed ?*/}
                                                {/*    <div>*/}
                                                {/*        /!*{this.state.coughLoaded ?*!/*/}
                                                {/*        /!*    <FlipCard componentName="Cough" currentStatus="Yet to Begin"*!/*/}
                                                {/*        /!*              componentValue="Normal" flipped={true}/> :*!/*/}
                                                {/*        /!*    <FlipCard componentName="Cough" currentStatus="Yet to Begin"*!/*/}
                                                {/*        /!*              componentValue="Un Normal" flipped={false}/>}*!/*/}
                                                {/*    </div>*/}
                                                {/*    : ""*/}
                                                {/*}*/}
                                            </motion.div>

                                        </Col>
                                        {/*</Row>*/}
                                        <Col lg="2.9">
                                            <motion.div
                                                initial={{scaleY: 0}}
                                                animate={{scaleY: 1}}
                                                // exit={{scaleY: 0}}
                                                transition={{duration: 0.5}}
                                            >
                                                {this.displayFlipCard(this.state.coughDisplayed, this.state.breathCountLoaded, "Breath Count", this.state.breathStatus)}
                                                {/*{this.state.coughDisplayed ?*/}
                                                {/*    <div>*/}
                                                {/*        {this.state.breathCountLoaded ?*/}
                                                {/*            <FlipCard componentName="Breathing Count"*/}
                                                {/*                      currentStatus="Yet to Begin"*/}
                                                {/*                      componentValue={this.state.breathStatus}*/}
                                                {/*                      flipped={true}/> :*/}
                                                {/*            <FlipCard componentName="Breathing Count"*/}
                                                {/*                      currentStatus="Yet to Begin"*/}
                                                {/*                      componentValue="Un Normal" flipped={false}/>*/}
                                                {/*        }*/}
                                                {/*    </div>*/}
                                                {/*    : ""*/}
                                                {/*}*/}

                                            </motion.div>
                                        </Col>
                                        <Col lg="2.9">
                                            <motion.div
                                                initial={{scaleY: 0}}
                                                animate={{scaleY: 1}}
                                                // exit={{scaleY: 0}}
                                                transition={{duration: 0.5}}
                                            >
                                                {this.displayFlipCard(this.state.breathCountDisplayed, this.state.temperatureStatusLoaded, "Temperature", this.state.temperatureStatus)}
                                                {/*{this.state.breathCountDisplayed ?*/}
                                                {/*    <div>*/}
                                                {/*        {this.state.temperatureStatusLoaded ?*/}
                                                {/*            <FlipCard componentName="Body temperatureStatus"*/}
                                                {/*                      currentStatus="Yet to Begin"*/}
                                                {/*                      componentValue={this.state.temperatureStatus}*/}
                                                {/*                      flipped={true}/> :*/}
                                                {/*            <FlipCard componentName="Body temperatureStatus"*/}
                                                {/*                      currentStatus="Yet to Begin"*/}
                                                {/*                      componentValue="Un Normal" flipped={false}/>*/}
                                                {/*        }*/}
                                                {/*    </div>*/}
                                                {/*    : ""*/}
                                                {/*}*/}
                                            </motion.div>
                                        </Col>
                                        {/*<Col lg="2.9">*/}
                                        {/*    <FlipCard componentName="Pulse Rate" currentStatus="Yet to Begin"*/}
                                        {/*              componentValue="160"/>*/}
                                        {/*</Col>*/}
                                        {/*</Row>*/}
                                        {/*<Row style={{width: '20em', height: '11em'}}>*/}
                                        {/*    /!*    <Card className="" style={{minHeight:"15em", minWidth:"109em", marginLeft:"32%"}}>*!/*/}
                                        {/*    /!*        <CardHeader >*!/*/}
                                        {/*    /!*            <h3 className="">Final Result</h3>*!/*/}
                                        {/*    /!*            <CardTitle tag="h2" style={{marginTop:"2%"}}>*!/*/}
                                        {/*    /!*                <i className="tim-icons icon-bell-55 text-info" /> Ubata Ledak Naaaa*!/*/}
                                        {/*    /!*            </CardTitle>*!/*/}
                                        {/*    /!*        </CardHeader>*!/*/}
                                        {/*    /!*        /!*<CardBody>*!/*!/*/}

                                        {/*    /!*        /!*</CardBody>*!/*!/*/}
                                        {/*    /!*    </Card>*!/*/}
                                        {/*</Row>*/}
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


// style={{
                             //     border: "5px solid #013a55",
                             //     width: "35%",
                             //     minHeight: "40%",
                             //     marginLeft: "auto",
                             //     marginRight: "auto",
                             //     alignContent: "center",
                             //     borderRadius: "5%"
                             // }}
