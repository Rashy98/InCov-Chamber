import '../App.css';
import "../assets/scss/black-dashboard-react.scss";
import "../assets/css/nucleo-icons.css";
import React,{Component} from "react";
import FlipCard from "./flipCard";
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


class MainDashboard extends Component {
    constructor(props) {
        super(props);

        this.state={

        }

    }
    render() {
        return (
            <div className="App">
                <Row>
                    <Col xs="12">
                        <Card className="card-chart">
                            <CardHeader>
                                <Row>
                                    <Col md="">
                                        <Card className="card-user">
                                            <CardBody style={{minHeight: "30em"}}>
                                                <CardText/>
                                                <div className="author">
                                                    <div className="block block-one"/>
                                                    <div className="block block-two"/>
                                                    <div className="block block-three"/>
                                                    <div className="block block-four"/>
                                                    <a href="#pablo" onClick={(e) => e.preventDefault()}>
                                                        <img
                                                            alt="..."
                                                            className="avatar"
                                                            src={`data:image/jpeg;base64,${this.props.location.state.employee.photo}`}
                                                            style={{marginTop: "0em", width: "14em", height: "14em"}}
                                                        />
                                                        <h3 className="title">{this.props.location.state.employee.fullName}</h3>
                                                    </a>
                                                    <p className="description">{this.props.location.state.employee.position}</p>
                                                </div>

                                            </CardBody>

                                        </Card>
                                    </Col>
                                </Row>

                            </CardHeader>

                            <CardBody>
                                <Row style={{marginLeft: "8%", marginTop: "5%"}}>
                                    <Col lg="2.9">
                                        <FlipCard componentName="Smell Level" currentStatus="Yet to Begin"
                                                  componentValue="Normal"/>
                                    </Col>
                                    <Col lg="2.9">
                                        <FlipCard componentName="Cough" currentStatus="Yet to Begin"
                                                  componentValue="Normal"/>
                                    </Col>
                                    <Col lg="2.9">
                                        <FlipCard componentName="Breathing Count" currentStatus="Yet to Begin"
                                                  componentValue="10 - Normal"/>
                                    </Col>
                                    <Col lg="2.9">
                                        <FlipCard componentName="Body Temperature" currentStatus="Yet to Begin"
                                                  componentValue="37.5 - Mild"/>
                                    </Col>
                                    <Col lg="2.9">
                                        <FlipCard componentName="Pulse Rate" currentStatus="Yet to Begin"
                                                  componentValue="160"/>
                                    </Col>
                                </Row>
                                <Row style={{width: '20em', height: '11em'}}>
                                    {/*    <Card className="" style={{minHeight:"15em", minWidth:"109em", marginLeft:"32%"}}>*/}
                                    {/*        <CardHeader >*/}
                                    {/*            <h3 className="">Final Result</h3>*/}
                                    {/*            <CardTitle tag="h2" style={{marginTop:"2%"}}>*/}
                                    {/*                <i className="tim-icons icon-bell-55 text-info" /> Ubata Ledak Naaaa*/}
                                    {/*            </CardTitle>*/}
                                    {/*        </CardHeader>*/}
                                    {/*        /!*<CardBody>*!/*/}

                                    {/*        /!*</CardBody>*!/*/}
                                    {/*    </Card>*/}
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
};

export default MainDashboard;
