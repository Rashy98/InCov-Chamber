import '../App.css';
import ParticleBackground from "../User/LandingPage";
import logos from '../assets/Images/logo.png';
import React,{Component} from "react";
import UserDetailsDashboard from "./UserDetailsDashboard";
import {Link,useHistory,Redirect} from "react-router-dom";


class LandingApp extends Component {

    constructor() {
        super();
        this.state={
            emp_name: ''
        }
        this.auth_module = this.auth_module.bind(this)
        // this.sendToUserDetailedDashboard = this.sendToUserDetailedDashboard.bind(this);

    }

    async componentDidMount(){
         await this.auth_module();
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
    }

    // sendToUserDetailedDashboard(){
    //         window.open("/UserDetailsDashboard");
    // }


    render() {

        return (
            <div className="card-user" style={{position: 'relative', overflow: "hidden"}}>
                <div style={{position: 'absolute', minWidth: "100%", Height: "100%", marginTop: "1%"}}>
                    <ParticleBackground/>

                </div>
                {/*<div>*/}
                {/*    <ParticleBackground/>*/}
                {/*    <img src={logos} className="App-logo" alt="logo" />*/}
                {/*    <p>*/}
                {/*        Edit <code>src/App.js</code> and save to reload.*/}
                {/*    </p>*/}
                {/*</div>*/}


                <header className="App-header1">
                    <img src={logos} className="App-logo" alt="logo"/>
                    <h1 style={{color: "black", fontWeight: "bold"}}>
                        Welcome to INCOV Chamber
                    </h1>
                    {this.state.emp_name === "" ?
                        <h2 style={{color: "#00aa86", fontWeight: "bold"}}>
                            {/*{this.state.emp_name}*/}
                            Recognizing your Face...
                        </h2> :
                        <div>
                            return <Redirect to={{pathname:"/UserDetailsDashboard", state:{id:this.state.emp_name}}}/>
                        </div>

                        // this.sendToUserDetailedDashboard()

                    }
                </header>
            </div>
        );
    };
};



export default LandingApp;
