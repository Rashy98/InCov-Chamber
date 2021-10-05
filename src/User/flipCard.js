import Flippy, {FrontSide, BackSide} from 'react-flippy';
import React, {Component} from "react";
import {Card, CardHeader, CardTitle} from "reactstrap";

// ... component class

class FlipCard extends Component {


    render() {
        return (
            <Flippy
                flipOnHover={false} // default false
                flipOnClick={false}
                isFlipped={this.props.flipped}// default false
                flipDirection="horizontal" // horizontal or vertical
                ref={(r) => this.flippy = r}
                // to use toggle method like this.flippy.toggle()
                // if you pass isFlipped prop component will be controlled component.
                // and other props, which will go to div
                style={{
                    width: '60%',
                    height: '10%',
                    marginLeft: '20%',
                    boxShadow: "0 0px 0px 0 rgba(0,0,0,.2)"
                }} /// these are optional style, it is not necessary
            >
                <FrontSide style={{boxShadow: "0 0px 0px 0 rgba(0,0,0,.2)"}}>
                    <Card >
                        <CardHeader style={{minHeight: "9em"}}>
                            <h1 className="" style={{color: "white", fontWeight: "bold"}}>{this.props.componentName}</h1>
                            <CardTitle tag="h2">
                                 {this.props.currentStatus}
                            </CardTitle>
                        </CardHeader>
                        {/*<CardBody>*/}

                        {/*</CardBody>*/}
                    </Card>

                </FrontSide>
                <BackSide style={{boxShadow: "0 0px 0px 0 rgba(0,0,0,.2)"}}>
                    <Card style={{backgroundColor : "#60BFAA"}}>
                        <CardHeader style={{minHeight: "9em"}}>
                            <h1 className="" style={{color: "#1A425D", fontWeight: "bold"}}>{this.props.componentName}</h1>
                            <CardTitle tag="h2" >
                                 {this.props.componentValue}
                            </CardTitle>
                        </CardHeader>
                        {/*<CardBody>*/}

                        {/*</CardBody>*/}
                    </Card>
                </BackSide>
            </Flippy>
        );
    }

}

export default FlipCard;