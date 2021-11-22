/*
    Component that is used to function the flip cards used.
*/


// importing needed libraries
import Flippy, {FrontSide, BackSide} from 'react-flippy';
import React, {Component} from "react";
import {Card, CardHeader, CardTitle} from "reactstrap";

class FlipCard extends Component {

    render() {
        return (
            <Flippy
                flipOnHover={false}
                flipOnClick={false}
                isFlipped={this.props.flipped}
                flipDirection="horizontal"
                ref={(r) => this.flippy = r}
                style={{
                    width: '60%',
                    height: '10%',
                    marginLeft: '20%',
                    boxShadow: "0 0px 0px 0 rgba(0,0,0,.2)"
                }}
            >
                <FrontSide style={{boxShadow: "0 0px 0px 0 rgba(0,0,0,.2)"}}>
                    <Card >
                        <CardHeader style={{minHeight: "9em"}}>
                            <h1 className="" style={{color: "white", fontWeight: "bold"}}>{this.props.componentName}</h1>
                            <CardTitle tag="h2">
                                 {this.props.currentStatus}
                            </CardTitle>
                        </CardHeader>

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
                    </Card>
                </BackSide>
            </Flippy>
        );
    }

}

export default FlipCard;