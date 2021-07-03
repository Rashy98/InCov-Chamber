import '../App.css';
import "../assets/scss/black-dashboard-react.scss";
import "../assets/css/nucleo-icons.css";
import React, {Component} from "react";
import FlipCard from "./flipCard";
import audio from './../sound/welcome.wav';
import anosmia01 from './../sound/anosmia01.wav';
import anosmia02 from './../sound/anosmia02.wav';
import ask_to_cough from './../sound/ask_to_cough.wav';
import {AnimatePresence, motion} from 'framer-motion';
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


class MainDashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            anosmia_classifier_value: '',
            anosmia_status: '',
            recordingStatus: '',
            predictLabel: '',
            predictPercentage: 0,
            temperature: 0,
            breath_count: 0,
            thermalModuleLoaded: false,
            temperatureLoaded: false,
            breathCountLoaded: false,
            coughLoaded: false,
            anosmiaLoaded: false,
            anosmiaDisplayed: false,
            coughDisplayed: false,
            breathCountDisplayed: false,
            temperatureDisplayed: false
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
        this.get_temperature = this.get_temperature.bind(this)
        this.get_breath_count = this.get_breath_count.bind(this)
        this.displayFlipCard = this.displayFlipCard.bind(this)
        this.setDisplayState = this.setDisplayState.bind(this)
    }

    componentDidMount() {
        const audioEl = document.getElementsByClassName("audio-element")[0]
        audioEl.play()
        this.soundCommand()
        this.thermal_module()
        // this.get_temperature()
        // setTimeout(function (){
        //     this.get_breath_count()
        // }.bind(this), 2000)

    }

    soundCommand() {
        setTimeout(this.AnosmiaGetData, 10000);
        // setTimeout(this.PlayCoughSaying, 20000);
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

    AnosmiaGetData() {
        this.audio = new Audio(anosmia01)
        this.audio.load()
        this.playAudio()

        setTimeout(fetch('/anosmia', {
            method: 'GET',
        }).then((response) => {
            response.json().then((body) => {

                if (body.classifier_value === '') {
                    this.soundCommand()
                } else {

                    this.setState({
                        anosmia_classifier_value: body.classifier_value,
                        anosmiaLoaded: true,
                        anosmiaDisplayed: true
                    })


                    if (body.classifier_value === 'yes') {
                        setTimeout(this.getAnosmiaFragrance(), 2000)
                    } else {

                        var arduino_val = body.arduino_value

                        if (arduino_val > 1500) {
                            this.setState({
                                anosmia_status: 'Unusual'
                            })
                        } else {
                            this.setState({
                                anosmia_status: 'Normal'
                            })
                        }
                        this.PlayCoughSaying()
                    }

                }
            });

        }), 1200)


    }

    getAnosmiaFragrance() {
        this.audio = new Audio(anosmia02)
        this.audio.load()
        this.playAudio()

        fetch('/anosmiaFrag', {
            method: 'POST',
        }).then((response) => {
            response.json().then((body) => {
                var status = ''

                if(body.status === 'LIAR'){
                    status = "Unusual"
                } else {
                    status = "Normal"
                }

                this.setState({
                    anosmia_status: status,
                })
                this.PlayCoughSaying()
            });
        });
    }

    PlayCoughSaying() {
        this.audio = new Audio(ask_to_cough)
        this.audio.load()
        this.playAudio()
        let value = '';

        setTimeout(this.CoughRecording, 4200);
        //
        //

    }

    CoughRecording() {
        fetch('/recordCough', {
            method: 'GET',
            // body: JSON.stringify(payload),
        }).then((response) => {
            response.json().then((body) => {
                console.log(body)
                this.setState({
                    recordingStatus: body,

                })
                // if(response == 'created'){

                //     setTimeout(this.PREDICTION,8000)
                // }


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

                if (12 <= breathCount && breathCount <= 18){
                    breathStatus = 'Normal'
                } else {
                    breathStatus = 'Unusual'
                }

                this.setState({
                    temperature: body.temperature + "\u00b0 C",
                    breath_count: breathStatus,
                    thermalModuleLoaded: true
                })
            })
        })
    }

    get_temperature() {
        fetch('get_temperature', {
            method: 'GET'
        }).then((response) => {
            response.json().then((body) => {
                this.setState({
                    temperature: body.temperature + "\u00b0 C"
                })
            })
        })
    }

    get_breath_count() {
        fetch('get_breath_count', {
            method: 'GET'
        }).then((response) => {
            response.json().then((body) => {

                var breathStatus = ''

                if (12 <= (body.breath_count * 2) <= 18){
                    breathStatus = 'Normal'
                } else {
                    breathStatus = 'Unusual'
                }

                this.setState({
                    breath_count: breathStatus
                })
            })
        })
    }

    getCoughPrediction() {
        let value = '';
        fetch('/predictCough', {
            method: 'GET',

        }).then((response) => {
            response.json().then((body) => {

                var predictLabel = ''

                if (body.prediction_label === 'healthy'){
                    predictLabel = 'Normal'
                } else {
                    predictLabel = 'Unusual'
                }

                this.setState({
                    predictLabel: predictLabel,
                    predictPercentage: parseFloat(body.percentage) * 100 + " %",
                    coughLoaded: true,
                })

                this.setDisplayState("coughDisplayed", "breathCountLoaded", 2000, 4000)
                this.setDisplayState("breathCountDisplayed", "temperatureLoaded", 6000, 8000)

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

        setTimeout(function () {
                this.setState({
                    [state2]: true
                })
            }.bind(this),
            timeOut2
        )
    }

    render() {
        return (
            <div className="App">
                <Row>
                    <div>
                        <audio className="audio-element">
                            <source src={audio}></source>
                        </audio>
                    </div>
                    <Col xs="12">
                        <Card className="card-chart">
                            <CardHeader>
                                <Row style={{marginLeft: '5%'}}>
                                    <Col sm={4} style={{marginTop: '10%'}}>
                                        <Card className="card-user" style={{height: "70%"}}>
                                            <CardBody style={{height: "70%"}}>
                                                <CardText/>
                                                <div className="author">
                                                    <div className="block block-one"/>
                                                    <div className="block block-two"/>
                                                    <div className="block block-three"/>
                                                    <div className="block block-four"/>
                                                    <a href="#pablo" onClick={(e) => e.preventDefault()}>
                                                        <img
                                                            alt="..."
                                                            className="avatar"
                                                            src={`data:image/jpeg;base64,${this.props.location.state.employee.photo}`}
                                                            style={{marginTop: "0em", width: "14em", height: "14em"}}
                                                        />
                                                        <h3 className="title">{this.props.location.state.employee.fullName}</h3>
                                                    </a>
                                                    <p className="description">{this.props.location.state.employee.position}</p>
                                                </div>

                                            </CardBody>

                                        </Card>
                                    </Col>
                                    <Col sm={8} style={{marginTop: '5%'}}>
                                        {/*<Row style={{ width: '90%', height: '10%', marginLeft:"5%" }}>*/}
                                        <Col lg="2.9">
                                            <motion.div
                                                initial={{scaleY: 0}}
                                                animate={{scaleY: 1}}
                                                // exit={{scaleY: 0}}
                                                transition={{duration: 0.5}}
                                            >
                                                {this.displayFlipCard(true, this.state.anosmiaLoaded, "Smell Level", this.state.anosmia_status)}
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
                                                {this.displayFlipCard(this.state.anosmiaDisplayed, this.state.coughLoaded, "Cough", this.state.predictLabel)}
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
                                                {this.displayFlipCard(this.state.coughDisplayed, this.state.breathCountLoaded, "Breath Count", this.state.breath_count)}
                                                {/*{this.state.coughDisplayed ?*/}
                                                {/*    <div>*/}
                                                {/*        {this.state.breathCountLoaded ?*/}
                                                {/*            <FlipCard componentName="Breathing Count"*/}
                                                {/*                      currentStatus="Yet to Begin"*/}
                                                {/*                      componentValue={this.state.breath_count}*/}
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
                                                {this.displayFlipCard(this.state.breathCountDisplayed, this.state.temperatureLoaded, "Temperature", this.state.temperature)}
                                                {/*{this.state.breathCountDisplayed ?*/}
                                                {/*    <div>*/}
                                                {/*        {this.state.temperatureLoaded ?*/}
                                                {/*            <FlipCard componentName="Body Temperature"*/}
                                                {/*                      currentStatus="Yet to Begin"*/}
                                                {/*                      componentValue={this.state.temperature}*/}
                                                {/*                      flipped={true}/> :*/}
                                                {/*            <FlipCard componentName="Body Temperature"*/}
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

                            {/*<CardBody>*/}

                            {/*</CardBody>*/}
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
};

export default MainDashboard;
