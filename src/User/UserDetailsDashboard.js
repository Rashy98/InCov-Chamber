/*
    Component that displays user details after recognizing the person
*/

//importing needed libraries
import React, {Component} from "react";
import Loader from "react-loader-spinner";
import {Redirect} from "react-router-dom";
import axios from "axios";
import {
    Card,
    CardBody,
    CardText,
} from "reactstrap";

//importing assets
import '../App.css';
import "../assets/scss/black-dashboard-react.scss";
import "../assets/css/nucleo-icons.css";
import "../assets/scss/black-dashboard-react/custom/cards/_card-border.scss"
import logo from "../assets/Images/logo.png"
import Background from "../assets/Images/NewBack2.png"




class UserDetailsDashboard extends Component {

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

    componentDidMount() {
        this.getEmployees();
    }

    // Setting a timeout for 5s
    timeOutFn(emp) {
        setTimeout(() => {
            this.setState({
                redirect: true
            })

        }, 5000)
    }

    // Retrieving the user details that is inside the chamber
    getEmployees() {
        axios({
            method: 'post',
            url: "https://incovbackend.herokuapp.com/employee/getEmp",
            headers: {},
            data: {
                empID: this.props.location.state.id, // This is the body part
            }
        }).then(res => {
            this.setState({
                employees: res.data.result,
                name: res.data.result.fullName,
                position: res.data.result.position,
                photo: res.data.result.photo,
                isLoading: false,
                imgLoaded: true
            })
        });


    }


    // Rendering method
    render() {

        return (
            <div className="App" style={{backgroundColor: "white", backgroundImage : `url(${Background})`, backgroundPosition : "center", backgroundRepeat: "no-repeat", backgroundSize : "cover"}}>
                <Card className="card-user"
                      style={{
                          width: "40%",
                          marginLeft: "auto",
                          marginRight: "auto"
                      }}>
                    <CardBody>
                        <CardText/>
                        <div className="author">
                            <a href="#pablo" onClick={(e) => e.preventDefault()}>
                                {
                                    this.state.imgLoaded ?
                                        <img
                                            className="avatar"
                                            style={{marginTop: "8%", marginBottom: "5%"}}
                                            src={`data:image/jpeg;base64,${this.state.photo}`}
                                        />
                                        :
                                        <img
                                            style={{marginTop: "8%",  width: "300px", height: "300px", marginLeft: "2.4%"}}
                                            src={logo}
                                        />
                                }


                                <h2 className="title"
                                    style={{marginBottom: "1%", color: "black"}}>{this.state.name}</h2>
                                <h2 className="description" style={{color: "black"}}>{this.state.position}</h2>
                            </a>
                            <br/>
                            <h2 className="description" style={{color: "#00aa86"}}>Chamber will Automatically Begin the Tests...</h2>
                            <Loader
                                type="Puff"
                                color="#00BFFF"
                                height={50}
                                width={50}
                                timeout={60000} //30min secs timeout
                                style ={{marginBottom : "5%"}}
                            />
                        </div>

                        {this.state.isLoading ?
                            ""
                            :
                            <div>
                                {this.timeOutFn()}
                                {this.state.redirect ?
                                    <div>
                                        return (
                                        <Redirect to={{
                                            pathname: "/MainDashboard",
                                            state: {employee: this.state.employees}
                                        }}
                                        />
                                        )
                                    </div>
                                    :
                                    ""
                                }
                            </div>
                        }
                    </CardBody>
                </Card>
            </div>
        );
    }
};

export default UserDetailsDashboard;
