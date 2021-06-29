import React, {Component} from "react";
import NavBar from "./Navbar";
import DashboardComponent from "./DashboardComponent";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import LocalHospitalIcon from "@material-ui/icons/LocalHospital";
import FavoriteIcon from "@material-ui/icons/Favorite";
import DateRange from "@material-ui/icons/DateRange";
// import Photo from "../assets/Images/0KSi2atlmsXNcGMfpDNzIjJSvC23.png";
import {Button} from "react-bootstrap";
import axios from "axios";

export default class Dashboard extends Component {

    constructor(props) {
        super(props);
        this.state={
            placeholder :'hi',
            employees:[]
        }

        this.getHello = this.getHello.bind(this);

    }


    getHello(){

        fetch('/hello').then(res => res.json()).then(data => {
            console.log(data)
            this.setState({
                placeholder : data.result
            })
        });


    }

    getEmployees(){
          axios.get('http://localhost:8000/employee/')
            .then(res => {
                console.log(res.data[0])
                this.setState({
                    employees: res.data[0]
                })
            })
    }

    componentDidMount() {
        this.getHello();
        this.getEmployees();
    }

    render() {

        return (
            <div style={{marginLeft:'25em'}}>

    <NavBar />
        <br/>
        <div className='ml-lg-auto  ' style={{textAlign: 'center'}}>
    <DashboardComponent Count='20' subTitle='Total Number of tests Done' heightC='20em' widthC='75em' color1='#ff9900' color2='#ffcc00' iconColor="success" rangeIcon=<DateRange/>/>
        <div className='form-inline ' style={{marginLeft:'6em'}}>
    <DashboardComponent Count='20' subTitle='Total Number of tests Done' heightC='18em' widthC='20em' range='Last 24 hours' color2='#ffcc00'  iconColor="primary" iconC=<SupervisorAccountIcon/> rangeIcon=<DateRange/>/>
        <DashboardComponent Count='2' subTitle='Total Number of Positive suspects' heightC='18em' widthC='20em' range='Last 24 hours' color2='#ccffdd'  iconColor="danger" iconC=<LocalHospitalIcon/> rangeIcon=<DateRange/> />
        <DashboardComponent Count='18' subTitle='Total Number of Healthy people' heightC='18em' widthC='20em'  range='Last 24 hours' color2='#ff8080'  iconColor="success" iconC=<FavoriteIcon/>  rangeIcon=<DateRange/>/>
        </div>
        </div>
        </div>
    )
    }



}
