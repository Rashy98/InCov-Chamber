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
                    marginLeft: '20%'
                }} /// these are optional style, it is not necessary
            >
                <FrontSide>
                    <Card >
                        <CardHeader style={{minHeight: "9em"}}>
                            <h2 className="">{this.props.componentName}</h2>
                            <CardTitle tag="h3">
                                <i className="tim-icons icon-bell-55 text-info"/> {this.props.currentStatus}
                            </CardTitle>
                        </CardHeader>
                        {/*<CardBody>*/}

                        {/*</CardBody>*/}
                    </Card>

                </FrontSide>
                <BackSide>
                    <Card >
                        <CardHeader style={{minHeight: "9em"}}>
                            <h2 className="">{this.props.componentName}</h2>
                            <CardTitle tag="h3">
                                <i className="tim-icons icon-bell-55 text-info"/> {this.props.componentValue}
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