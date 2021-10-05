import '../App.css';
import "../assets/scss/black-dashboard-react.scss";
import "../assets/css/nucleo-icons.css";
import "../assets/scss/black-dashboard-react/custom/cards/_card-border.scss"
// import ReactCardFlip from "react-card-flip";
// import ReactDOM from "react-dom";
import React, {useState, Component} from "react";
import Loader from "react-loader-spinner";
import {Redirect} from "react-router-dom";
import logo from "../assets/Images/logo.png"
import Background from "../assets/Images/NewBack1.jpg"


//import "./assets/"


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
import axios from "axios";


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

    timeOutFn(emp) {
        setTimeout(() => {
            this.setState({
                redirect: true
            })

        }, 5000)
    }

    getEmployees() {
        axios({
            method: 'post',
            url: "https://incovbackend.herokuapp.com/employee/getEmp",
            headers: {},
            data: {
                empID: this.props.location.state.id, // This is the body part
            }
        }).then(res => {
            // console.log(res.data.result.fullName);
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

    render() {

        return (
            <div className="App" style={{backgroundColor: "white", backgroundImage : `url(${Background})`, backgroundPosition : "center", backgroundRepeat: "no-repeat", backgroundSize : "cover"}}>
                <Card className="card-user"
                      style={{
                          // border : "5px solid black",
                          width: "40%",
                          // height : "50em",
                          marginLeft: "auto",
                          marginRight: "auto"
                      }}>
                    <CardBody>
                        <CardText/>
                        <div className="author"  //bb is the custom scss file
                             // style={{
                             //     border: "5px solid #013a55",
                             //     width: "80%",
                             //     minHeight: "40%",
                             //     marginLeft: "auto",
                             //     marginRight: "auto",
                             //     alignContent: "center",
                             //     borderRadius: "5%"
                             // }}
                        >
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
                                            // className="avatar"
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
                                timeout={60000} //30 secs
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
                                    : ""
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
