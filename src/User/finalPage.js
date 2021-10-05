import '../App.css';
import "../assets/scss/black-dashboard-react.scss";
import "../assets/css/nucleo-icons.css";
// import ReactCardFlip from "react-card-flip";
// import ReactDOM from "react-dom";
import React, {useState, Component} from "react";
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
import * as url from "url";


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

    componentDidMount() {
        // this.getEmployees();
    }

    timeOutFn(emp) {
        setTimeout(() => {
            this.setState({
                redirect: true
            })

        }, 5000)
    }

    // getEmployees(){
    //     axios({
    //           method: 'post',
    //           url: "https://incovbackend.herokuapp.com/employee/getEmp",
    //           headers: {},
    //           data: {
    //             empID: this.props.location.state.id, // This is the body part
    //           }
    //         }).then(res =>{
    //             // console.log(res.data.result.fullName);
    //             this.setState({
    //                 employees: res.data.result,
    //                 name:res.data.result.fullName,
    //                 position:res.data.result.position,
    //                 photo:res.data.result.photo,
    //                 isLoading:false,
    //                 imgLoaded: true
    //             })
    //     });
    //
    //
    // }


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
                                {/*    <h2 className="title">{this.state.name}</h2>*/}
                            </a>
                            {/*<h4 className="d






                               escription">{this.state.position}</h4>*/}
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
