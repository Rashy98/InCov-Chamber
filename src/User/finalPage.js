/*
    Component that displays the final decision to the user
        - Whether to leave the chamber or to stay outside for a while
*/


// importing needed libraries
import React, { Component} from "react";
import {
    Card,
    CardBody,
    CardText,
} from "reactstrap";

// importing assets
import '../App.css';
import "../assets/scss/black-dashboard-react.scss";
import "../assets/css/nucleo-icons.css";
import logo from "../assets/Images/logo.png"


class FinalPage extends Component {

    constructor(props) {
        super(props);


        this.state = {
            employees: [],
            isLoading: true,
            name: "",
            position: "",
            photo: "",
            redirect: false,
            imgLoaded: false
        }
        this.timeOutFn = this.timeOutFn.bind(this);

    }

    // Set a timeout for 5 seconds
    timeOutFn(emp) {
        setTimeout(() => {
            this.setState({
                redirect: true
            })

        }, 5000)
    }


    render() {
        return (
            <div className="App" >
                <Card className="card-two">
                    <CardBody>
                        <CardText/>
                        <div className="author">
                            <a href="#pablo" onClick={(e) => e.preventDefault()}>
                                <img
                                    style={{width: "300px", height: "300px", marginLeft: "2.4%", borderRadius: "0%"}}
                                    className="avatar"
                                    src={logo}
                                />
                            </a>
                        </div>
                        <p style={{color: "#00aa86", fontWeight: "bold", fontSize: "8vh", marginLeft: "1%"}}>Thank You!</p>
                        <br/>
                        {this.props.location.state.isSafe ?
                            <p className="" style={{color: 'black', fontSize: "4vh", marginLeft: "1.4%"}}>You may leave the chamber</p>
                            :
                            <p className="" style={{color: 'black', fontSize: "4vh", marginLeft: "1.4%"}}>Please wait outside the chamber </p>
                        }
                    </CardBody>
                </Card>
            </div>
        );
    }
};

export default FinalPage;
