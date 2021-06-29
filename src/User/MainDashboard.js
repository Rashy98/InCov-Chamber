import '../App.css';
import "../assets/scss/black-dashboard-react.scss";
import "../assets/css/nucleo-icons.css";
import React,{Component} from "react";
import FlipCard from "./flipCard";
import audio from './../sound/welcome.wav';
import anosmia01 from './../sound/anosmia01.wav';
import anosmia02 from './../sound/anosmia02.wav';
import ask_to_cough from './../sound/ask_to_cough.wav';
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

        this.state={
            anosmia_classifier_value:'',
            anosmia_status : '',
            recordingStatus:'',
            predictLabel :'',
            predictPercentage : 0,
            coughLoaded:false
        }
        this.soundCommand = this.soundCommand.bind(this)
        this.AnosmiaGetData = this.AnosmiaGetData.bind(this)
        this.PlayCoughSaying = this.PlayCoughSaying.bind(this)
        this.PREDICTION = this.PREDICTION.bind(this)
        this.AnosmiaGetData = this.AnosmiaGetData.bind(this)
        this.CoughRecording = this.CoughRecording.bind(this)
        this.PlayCoughSaying = this.PlayCoughSaying.bind(this)
        this.soundCommand = this.soundCommand.bind(this)
        this.playAudio = this.playAudio.bind(this)

    }

    componentDidMount() {
        const audioEl = document.getElementsByClassName("audio-element")[0]
        audioEl.play()
        this.soundCommand()

    }

    soundCommand(){
         setTimeout(this.AnosmiaGetData,8000);
         setTimeout(this.PlayCoughSaying,24000);

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

    AnosmiaGetData(){
        console.log('aawa')
        this.audio = new Audio(anosmia01)
        this.audio.load()
        this.playAudio()
        setTimeout(fetch('/anosmia', {
            method: 'GET',
            // body: JSON.stringify(payload),
        }).then((response) => {
            response.json().then((body) => {
                console.log(response)
                if (body.classifier_value == ''){
                    this.soundCommand()
                }
                else {

                    this.setState({
                        anosmia_classifier_value: body.classifier_value,


                    })


                if(body.classifier_value == 'yes'){
                    setTimeout(this.getAnosmiaFragrance(),2000)
                }
                else{
                    if(parseFloat(body.arduino_value) > 1500 ){
                        this.setState({
                            anosmia_status:'Anosmia'
                        })
                    }
                    else{
                         this.setState({
                            anosmia_status:'Normal'
                        })
                    }
                }

            }});

        }),1200)
    }

    getAnosmiaFragrance(){
        this.audio = new Audio(anosmia02)
        this.audio.load()
        this.playAudio()

        // console.log(JSON.stringify(sendData))
        fetch('/anosmiaFrag', {
            method: 'POST',
            // body: JSON.stringify(sendData),
        }).then((response) => {
            response.json().then((body) => {
                console.log(response)
                this.setState({
                    anosmia_status : body.status,
                    // predictPercentage : body.percentage,
                })

            });
        });
    }
    PlayCoughSaying(){
        this.audio = new Audio(ask_to_cough)
        this.audio.load()
        this.playAudio()
        let value = '';
        setTimeout(this.CoughRecording,4200);
        //
        //

    }

    CoughRecording(){
         fetch('/recordCough', {
            method: 'GET',
            // body: JSON.stringify(payload),
        }).then((response) => {
            response.json().then((body) => {
                console.log(body)
                this.setState({
                    recordingStatus:body,
                    coughLoaded:true
                })
                // if(response == 'created'){

                //     setTimeout(this.PREDICTION,8000)
                // }


            });
        });
         setTimeout(this.PREDICTION,10000)

    }

    PREDICTION(){
        let value = '';
        fetch('/predictCough', {
            method: 'GET',
            // body: JSON.stringify(payload),
        }).then((response) => {
            response.json().then((body) => {
                console.log(response)
                this.setState({
                    predictLabel : body.prediction_label,
                    predictPercentage : parseFloat(body.percentage) * 100 +" %"  ,

                })

            });
        });
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
                                <Row>
                                    <Col md="">
                                        <Card className="card-user">
                                            <CardBody style={{minHeight: "30em"}}>
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
                                </Row>

                            </CardHeader>

                            <CardBody>
                                <Row style={{marginLeft: "8%", marginTop: "5%"}}>

                                    <Col lg="2.9">

                                        <FlipCard componentName="Smell Level" currentStatus="Yet to Begin"
                                                  componentValue="Normal" flipped={false}/>
                                    </Col>
                                    <Col lg="2.9">
                                        {this.state.coughLoaded?
                                        <FlipCard componentName="Cough" currentStatus="Yet to Begin"
                                                  componentValue="Normal" flipped={true}/>:
                                            <FlipCard componentName="Cough" currentStatus="Yet to Begin"
                                                  componentValue="Normal" flipped={false}/>
                                        }

                                    </Col>
                                    <Col lg="2.9">
                                        <FlipCard componentName="Breathing Count" currentStatus="Yet to Begin"
                                                  componentValue="10 - Normal"/>
                                    </Col>
                                    <Col lg="2.9">
                                        <FlipCard componentName="Body Temperature" currentStatus="Yet to Begin"
                                                  componentValue="37.5 - Mild"/>
                                    </Col>
                                    <Col lg="2.9">
                                        <FlipCard componentName="Pulse Rate" currentStatus="Yet to Begin"
                                                  componentValue="160"/>
                                    </Col>
                                </Row>
                                <Row style={{width: '20em', height: '11em'}}>
                                    {/*    <Card className="" style={{minHeight:"15em", minWidth:"109em", marginLeft:"32%"}}>*/}
                                    {/*        <CardHeader >*/}
                                    {/*            <h3 className="">Final Result</h3>*/}
                                    {/*            <CardTitle tag="h2" style={{marginTop:"2%"}}>*/}
                                    {/*                <i className="tim-icons icon-bell-55 text-info" /> Ubata Ledak Naaaa*/}
                                    {/*            </CardTitle>*/}
                                    {/*        </CardHeader>*/}
                                    {/*        /!*<CardBody>*!/*/}

                                    {/*        /!*</CardBody>*!/*/}
                                    {/*    </Card>*/}
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
};

export default MainDashboard;
