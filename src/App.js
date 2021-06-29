import React from 'react';
import {HashRouter as Router, Route} from "react-router-dom";
import Dashboard from "./Common/Dashboard";
import DetailedDashboard from "./Common/DetailedDashboard";
import UserDetailsDashboard from "./User/UserDetailsDashboard";
import MainDashboard from "./User/MainDashboard";
import landingApp from "./User/landingApp";


function App() {
    return (
        <Router>

            <switch>
                <Route path="/" exact component={landingApp}/>
                <Route  path='/detailed' exact component={DetailedDashboard}/>
                <Route path='/UserDetailsDashboard' exact component={UserDetailsDashboard}/>
                <Route path='/MainDashboard' exact component={MainDashboard}/>


            </switch>
        </Router>
    );
}

export default App;
