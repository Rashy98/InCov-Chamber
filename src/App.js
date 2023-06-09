/*
    Main component which configure the paths for each component
*/

// importing needed libraries
import React from 'react';
import {HashRouter as Router, Route} from "react-router-dom";

// importing other components
import UserDetailsDashboard from "./User/UserDetailsDashboard";
import MainDashboard from "./User/MainDashboard";
import landingApp from "./User/landingApp";
import FinalPage from "./User/finalPage";


function App() {
    return (
        <Router>

            <switch>
                <Route path="/" exact component={landingApp}/>
                <Route path='/UserDetailsDashboard' exact component={UserDetailsDashboard}/>
                <Route path='/MainDashboard' exact component={MainDashboard}/>
                <Route path='/FinalPage' exact component={FinalPage}/>
            </switch>
        </Router>
    );
}

export default App;
