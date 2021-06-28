import Flippy, { FrontSide, BackSide } from 'react-flippy';
import React, {Component} from "react";
import {Card, CardHeader, CardTitle} from "reactstrap";
// ... component class

class FlipCard extends Component {


render() {
    return (
        <Flippy
        flipOnHover={false} // default false
        flipOnClick={true} // default false
        flipDirection="horizontal" // horizontal or vertical
        ref={(r) => this.flippy = r} // to use toggle method like this.flippy.toggle()
        // if you pass isFlipped prop component will be controlled component.
        // and other props, which will go to div
        style={{ width: '20em', height: '20em' }} /// these are optional style, it is not necessary
    >
        <FrontSide>
        <Card className="" >
            <CardHeader style={{minHeight:"18em"}}>
                <h3 className="">{this.props.componentName}</h3>
                <CardTitle tag="h4">
                    <i className="tim-icons icon-bell-55 text-info" /> {this.props.currentStatus}
                </CardTitle>
            </CardHeader>
            {/*<CardBody>*/}

            {/*</CardBody>*/}
            </Card>

        </FrontSide>
        <BackSide>
        <Card className="" >
            <CardHeader style={{minHeight:"18em"}}>
                <h3 className="">{this.props.componentName}</h3>
                <CardTitle tag="h4">
                    <i className="tim-icons icon-bell-55 text-info" /> {this.props.componentValue}
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