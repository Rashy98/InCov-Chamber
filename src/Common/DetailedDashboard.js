import React, {PureComponent, useEffect} from "react";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import NavBar from "./Navbar";
import DashboardComponent from "./DashboardComponent";
import logo from '../assets/Images/logo3.png';
import { CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Speech from 'react-speech';
import audio from './../sound/welcome.wav'
import anosmia01 from './../sound/anosmia01.wav'
import anosmia02 from './../sound/anosmia02.wav'
import ask_to_cough from './../sound/ask_to_cough.wav'
import 'react-voice-recorder/dist/index.css'
import axios from "axios";

export default class DetailedDashboard extends PureComponent {

    constructor(props) {
        super(props);
        this.state={
            audioDetails :{
                url:null,
                blob:null,
                chunks:null,
                duration:{
                    h:0,
                    m:0,
                    s:0
                }
            },
            anosmia_classifier_value:'',
            arduino_value:0,
            audioClip:'',
            placeholder :'hi',
            placeholder2 :'cough?',
            picturePreview:"",
            pictureAsFile:"",
            base64String:'',
            predictLabel :'',
            predictPercentage : 0,
            anosmia_status : '',
            employees :[],
            breath_count:0,
            // employees :[],
            recordingStatus:'',
            temperature: 0,
            emp_name: ''
        }
        this.PREDICTION = this.PREDICTION.bind(this)
        this.AnosmiaPrediction = this.AnosmiaPrediction.bind(this)
        this.playAudio = this.playAudio.bind(this)
        this.AnosmiaGetData = this.AnosmiaGetData.bind(this)
        this.CoughRecording = this.CoughRecording.bind(this)
        this.PlayCoughSaying = this.PlayCoughSaying.bind(this)
        this.soundCommand = this.soundCommand.bind(this)
        this.getEmployee = this.getEmployee.bind(this)
        this.thermal_module = this.thermal_module.bind(this)
        this.auth_module = this.auth_module.bind(this)
    }


    async componentDidMount() {
        // this.PREDICTION()
        await this.auth_module()
        this.getEmployee()
        const audioEl = document.getElementsByClassName("audio-element")[0]
        // const audioEl2 = document.getElementsByClassName("audio-element-2")[0]
        audioEl.play()
        this.soundCommand()
        this.thermal_module()
        // setTimeout(audioEl2.play(),10000);
    }

    getEmployee(){

      axios.get('http://localhost:8000/employee/')
            .then(res => {
                console.log(res.data[0])
                this.setState({
                    employees: res.data[0]
                })
            });
            // response.json().then((body) => {
            //     this.setState({
            //          employees : body,
            //         // predictPercentage : parseFloat(body.percentage) * 100 +" %"  ,
            //     })
            //
            // });
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
                    recordingStatus:body
                })
                // if(response == 'created'){

                //     setTimeout(this.PREDICTION,8000)
                // }


            });
        });
         setTimeout(this.PREDICTION,8000)

    }

    thermal_module(){
        fetch('thermal_module', {
            method: 'GET'
        }).then((response) => {
            response.json().then((body) => {
                this.setState({
                    temperature: body.temperature,
                    breath_count: body.breath_count * 2
                })
            })
        })
    }

    async auth_module(){
        await fetch('face_auth', {
            method: 'GET'
        }).then((response) => {
            response.json().then((body) => {
                this.setState({
                    emp_name: body.emp_name
                })
            })
        })
        // this.setState({
        //     emp_name: name
        // })
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

    AnosmiaPrediction()  {
        //e.preventDefault()
        console.log('pred ekata aaawa')
        // useEffect(() =>{
        //     this.AnosmiaGetData
        // },[])
        // setTimeout(this.AnosmiaGetData,10000);

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
                            anosmia_status:'Healthy'
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

    render() {
        return (
            <div style={{textAlign: 'center'}}>
                <div style={{marginLeft:'30em',textAlign: 'center'}} >
                    <NavBar />
                    <div className='ml-lg-auto  form-inline' style={{textAlign: 'center'}}>

                        <div>
                            <audio className="audio-element">
                              <source src={audio}></source>
                            </audio>
                        </div>
                        <DashboardComponent Count='37.7' subTitle='' heightC='20em' widthC='20em' color1='#ff9900' color2='#ffcc00' iconColor="success" iconC=<SupervisorAccountIcon/> photo={logo}/>
                        <div style={{marginLeft:'5em'}}>
                            <h1>{this.state.emp_name}</h1>
                            <br />
                            <h3>Employee</h3>
                        </div>
                    </div>
                </div>
                <div style={{marginLeft:'35em',textAlign: 'center'}} className='form-inline'>
                    <DashboardComponent  Count={this.state.temperature} subTitle='' heightC='15em' widthC='15em' color1='#ff9900' color2='#ffcc00' iconColor="warning"  range="Fever "/>
                    <div style={{marginLeft:'5em',marginRight:'5em',textAlign: 'center'}} className='form-inline'>
                        <div style={{ width: 200, height: 200,marginTop:'15em' }}>
                            <CircularProgressbarWithChildren value={66} styles={{
                                path: {
                                    // Path color
                                    stroke: `rgba(62, 190, 199)`,
                                    // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                                    strokeLinecap: 'butt',
                                    // Customize transition animation
                                    transition: 'stroke-dashoffset 0.5s ease 0s',
                                    // Rotate the path
                                    transform: 'rotate(0.25turn)',
                                    transformOrigin: 'center center',
                                },
                                trail: {
                                    // Trail color
                                    stroke: 'lightgreen',
                                    // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                                    strokeLinecap: 'butt',
                                    // Rotate the trail
                                    transform: 'rotate(0.25turn)',
                                    transformOrigin: 'center center',
                                },

                            }}>
                                <div style={{ fontSize: 25, marginTop: 5 }}>
                                    <strong>66%</strong>
                                </div>
                            </CircularProgressbarWithChildren>

                        </div>
                        <div style={{marginLeft:'5em'}}></div>
                        <DashboardComponent  Count={this.state.predictPercentage} subTitle={this.state.predictLabel.toUpperCase()} heightC='15em' widthC='15em' color1='#ff9900' color2='#ffcc00' iconColor="success"  range="Cough Percentage"/>
                    </div>
                    <div style={{marginLeft:'0em',textAlign: 'center',marginTop:'-5em'}} className='form-inline'>
                        <DashboardComponent  Count={this.state.anosmia_status.toUpperCase()} subTitle='' heightC='15em' widthC='15em' color1='#ff9900' color2='#ffcc00' iconColor="success"  range="Anosmia"/>
                        <div style={{marginLeft:'10em',width: 200, height: 300,}} ></div>
                        <DashboardComponent  Count={this.state.breath_count} subTitle='' heightC='15em' widthC='15em' color1='#ff9900' color2='#ffcc00' iconColor="success"  range="Shortness of Breath"/>

                    </div>


                </div>
            </div>
        );
    }
}
