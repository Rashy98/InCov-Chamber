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
import ask_to_cough from './../sound/ask_to_cough.wav'



import 'react-voice-recorder/dist/index.css'

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
            audioClip:'',
            placeholder :'hi',
            placeholder2 :'cough?',
            picturePreview:"",
            pictureAsFile:"",
            base64String:'',
            predictLabel :'',
            predictPercentage : 0,
            anosmia_status : '',
        }
        this.PREDICTION = this.PREDICTION.bind(this)
        this.AnosmiaPrediction = this.AnosmiaPrediction.bind(this)
        this.playAudio = this.playAudio.bind(this)
        this.AnosmiaGetData = this.AnosmiaGetData.bind(this)
        this.CoughRecording = this.CoughRecording.bind(this)
        this.PlayCoughSaying = this.PlayCoughSaying.bind(this)
    }


    componentDidMount() {
        // this.PREDICTION()

        const audioEl = document.getElementsByClassName("audio-element")[0]
        // const audioEl2 = document.getElementsByClassName("audio-element-2")[0]
        audioEl.play()
        setTimeout(this.AnosmiaGetData,10000);
        setTimeout(this.PlayCoughSaying,20000);
        // setTimeout(audioEl2.play(),10000);
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

        setTimeout(this.CoughRecording,5000);
        //
        //

    }

    CoughRecording(){
         fetch('/recordCough', {
            method: 'GET',
            // body: JSON.stringify(payload),
        }).then((response) => {
            response.json().then((body) => {
                console.log(response)
            });
        });
        setTimeout(this.PREDICTION,6000)

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
                    predictPercentage : body.percentage,
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
        fetch('/anosmia', {
            method: 'GET',
            // body: JSON.stringify(payload),
        }).then((response) => {
            response.json().then((body) => {
                console.log(response)
                this.setState({
                    anosmia_status : body.status,

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
                        {/*<div>*/}
                        {/*    <audio className="audio-element-2" wait ={10000}>*/}
                        {/*      <source src={anosmia01}></source>*/}
                        {/*    </audio>*/}
                        {/*</div>*/}
                        {/*{this.AnosmiaPrediction()}*/}
                        <DashboardComponent Count='' subTitle='' heightC='20em' widthC='20em' color1='#ff9900' color2='#ffcc00' iconColor="success" iconC=<SupervisorAccountIcon/> photo={logo}/>
                        <div style={{marginLeft:'5em'}}>
                            <h1>Rashini Liyanarachchi</h1>
                            <br />
                            <h3>Employee</h3>
                        </div>
                    </div>
                </div>
                <div style={{marginLeft:'35em',textAlign: 'center'}} className='form-inline'>
                    <DashboardComponent  Count='37.3' subTitle='' heightC='15em' widthC='15em' color1='#ff9900' color2='#ffcc00' iconColor="warning"  range="Fever "/>
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
                        <DashboardComponent  Count={this.state.predictPercentage} subTitle={this.state.predictLabel} heightC='15em' widthC='15em' color1='#ff9900' color2='#ffcc00' iconColor="success"  range="Cough Percentage"/>
                    </div>
                    <div style={{marginLeft:'0em',textAlign: 'center',marginTop:'-5em'}} className='form-inline'>
                        <DashboardComponent  Count={this.state.anosmia_status} subTitle='' heightC='15em' widthC='15em' color1='#ff9900' color2='#ffcc00' iconColor="success"  range="Anosmia"/>
                        <div style={{marginLeft:'10em',width: 200, height: 300,}} ></div>
                        <DashboardComponent  Count='' subTitle='' heightC='15em' widthC='15em' color1='#ff9900' color2='#ffcc00' iconColor="success"  range="Shortness of Breath"/>

                    </div>


                </div>
            </div>
        );
    }
}
