/*
    Component that displays the initial page of the standard user UI
    This component identifies the person who is inside the chamber using face recognition
*/


// importing needed libraries
import React,{Component} from "react";
import {Redirect} from "react-router-dom";

// importing other components
import ParticleBackground from "../User/LandingPage";

// importing assets
import logos from '../assets/Images/logo.png';
import '../App.css';


class LandingApp extends Component {

    constructor() {
        super();
        this.state={
            emp_name: ''
        }
        this.auth_module = this.auth_module.bind(this)

    }

    async componentDidMount(){
         await this.auth_module();
    }


    // Authenticating the person inside the chamber using face recognition
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
    }


    render() {

        return (
            <div className="card-user" style={{position: 'relative', overflow: "hidden"}}>
                <div style={{position: 'absolute', minWidth: "100%", Height: "100%", marginTop: "1%"}}>
                    <ParticleBackground/>
                </div>

                <header className="App-header1">
                    <img src={logos} className="App-logo" alt="logo"/>
                    <h1 style={{color: "black", fontWeight: "bold"}}>
                        Welcome to INCOV Chamber
                    </h1>

                    {/*
                        Redirect to the next component when the user is authenticated
                    */}

                    {this.state.emp_name === "" ?
                        <h2 style={{color: "#00aa86", fontWeight: "bold"}}>
                            Recognizing your Face...
                        </h2> :
                        <div>
                            return <Redirect to={{pathname:"/UserDetailsDashboard", state:{id:this.state.emp_name}}}/>
                        </div>

                    }
                </header>
            </div>
        );
    };
};



export default LandingApp;
