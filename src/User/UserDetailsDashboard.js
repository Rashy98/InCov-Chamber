import '../App.css';
import "../assets/scss/black-dashboard-react.scss";
import "../assets/css/nucleo-icons.css";
// import ReactCardFlip from "react-card-flip";
// import ReactDOM from "react-dom";
import React, {useState,Component} from "react";
import Loader from "react-loader-spinner";
import {Redirect} from "react-router-dom";
import logo from "../assets/Images/logo.png"



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

    constructor(props){
        super(props);

        this.state={
            employees:[],
            isLoading:true,
            name:"",
            position:"",
            photo:"",
            redirect: false,
            imgLoaded: false
        }
        this.timeOutFn = this.timeOutFn.bind(this);
    }

    componentDidMount() {
        this.getEmployees();
    }

    timeOutFn(emp){
        setTimeout( ()=>{this.setState({
            redirect:true
        })

        }, 5000)
    }
    getEmployees(){
        axios({
              method: 'post',
              url: "https://incovbackend.herokuapp.com/employee/getEmp",
              headers: {},
              data: {
                empID: this.props.location.state.id, // This is the body part
              }
            }).then(res =>{
                // console.log(res.data.result.fullName);
                this.setState({
                    employees: res.data.result,
                    name:res.data.result.fullName,
                    position:res.data.result.position,
                    photo:res.data.result.photo,
                    isLoading:false,
                    imgLoaded: true
                })
        });


    }







    render() {

        return (
            <div className="App">
                <Row>
                    <Col xl="12">
                        <Card className="mt-lg">
                            <CardHeader>
                                <Row>
                                    <Col md="">
                                        <Card className="card-user">
                                            <CardBody>
                                                <CardText/>
                                                <div className="author">
                                                    <div className="block block-one"/>
                                                    <div className="block block-two"/>
                                                    <div className="block block-three"/>
                                                    <div className="block block-four"/>
                                                    <a href="#pablo" onClick={(e) => e.preventDefault()}>
                                                        {
                                                            this.state.imgLoaded?
                                                                <img
                                                                    className="avatar"
                                                                    src={`data:image/jpeg;base64,${this.state.photo}`}
                                                                />
                                                                :
                                                                <img
                                                                    className="avatar"
                                                                    src={logo}
                                                                />
                                                        }



                                                        <h2 className="title">{this.state.name}</h2>
                                                    </a>
                                                    <h4 className="description">{this.state.position}</h4>
                                                </div>
                                                <br/>
                                                <h2 className="description">Chamber will Automatically Begin the
                                                    Process..</h2>
                                                <Loader
                                                    type="Puff"
                                                    color="#00BFFF"
                                                    height={50}
                                                    width={50}
                                                    timeout={60000} //30 secs
                                                />
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

export default UserDetailsDashboard;
