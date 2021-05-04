import React,{Component} from "react";

import logo from "../assets/Images/logo3.png";
import { Card,ListGroup,ListGroupItem } from 'react-bootstrap';
import {Link} from "react-router-dom";
import nav from "../assets/css/navbar.css";
import DashboardComponent from "./DashboardComponent";
// import axios from "axios";
// import { withRouter } from 'react-router-dom';
import background from "./../assets/Images/NavBack.jpg"
import Icon from "@material-ui/core/Icon";
import {ListItemIcon} from "@material-ui/core";
import Dashboard from "@material-ui/icons/Dashboard";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Description from "@material-ui/icons/Description";
import LineStyle from "@material-ui/icons/LineStyle";



class NavBar extends Component{

    constructor(props) {
        super(props);
        this.state={
            // isLoading : false
        }

        // this.createTable = this.createTable.bind(this);
    }

    render() {
        return (
            <div>
                <div className="sidenav" style={{backgroundImage: `url(${background})`}} >

                    <img src={logo} style={{width:'22em', height:'12em',marginLeft:'0%'}} />
                    <ul className="nav flex-sm-column mt-5 ml-5">
                        <li className="nav-item " style={{textAlign:'center'}}>
                            <div className='form-inline' ><Link className="nav-link" to="/"><ListItemIcon style={{color:'white'}}><Dashboard/> &nbsp; Dashboard</ListItemIcon></Link></div>
                        </li>
                        <li className="nav-item " style={{textAlign:'center'}}>
                            <div className='form-inline' ><Link className="nav-link" to="/LecHome"><ListItemIcon style={{color:'white'}}><AccountCircle/> &nbsp; User Profile</ListItemIcon></Link></div>
                        </li>
                        <li className="nav-item " style={{textAlign:'center'}}>
                            <div className='form-inline' ><Link className="nav-link" to="/LecHome"><ListItemIcon style={{color:'white'}}><Description/> &nbsp; Reports</ListItemIcon></Link></div>
                        </li>
                        <li className="nav-item " style={{textAlign:'center'}}>
                            <div className='form-inline' ><Link className="nav-link" to="/detailed"><ListItemIcon style={{color:'white'}}><LineStyle/> &nbsp; Detailed Dashboard</ListItemIcon></Link></div>
                        </li>
                    </ul>
                </div>

            </div>
        );
    }
}

export default NavBar;
