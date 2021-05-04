import React from 'react';
import {Card} from "react-bootstrap";
import CardHeader from "../components/Card/CardHeader";
import CardIcon from "../components/Card/CardIcon";
import Icon from "@material-ui/core/Icon";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import CardFooter from "../components/Card/CardFooter";
import DateRange from "@material-ui/icons/DateRange";
import {makeStyles} from "@material-ui/core/styles";
import styles from "./../assets/jss/material-dashboard-react/views/dashboardStyle.js";
import CardBody from "../components/Card/CardBody";
import CardMedia from "@material-ui/core/CardMedia";
// import logo from '../assets/Images/logo.jpg'


const useStyles = makeStyles(styles);
class DashboardComponent extends React.Component {
    color1 = this.props.color1;
    color2 = this.props.color2;
    render() {

        return (

            <div>

                <Card style={{width:this.props.widthC, height:this.props.heightC}} className='mt-5 ml-4'>
                    <CardHeader color={this.props.iconColor} stats icon>

                        <CardIcon color={this.props.iconColor}>
                            <Icon> {this.props.iconC}</Icon>
                        </CardIcon>
                        <Card.Img src={this.props.photo}></Card.Img>
                    </CardHeader>
                    <CardBody>

                        <h2 style={{color:'Red'}}>
                            {this.props.Count}
                        </h2>
                        <h3>{this.props.subTitle}</h3>
                    </CardBody>
                    <CardFooter stats>
                        <div >
                            <div style={{textAlign: 'center'}} >
                                {this.props.rangeIcon}
                                {this.props.range}
                            </div>
                        </div>
                    </CardFooter>
                </Card>

            </div>
        );
    }
}
export default DashboardComponent;
