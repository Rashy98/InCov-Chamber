import React from 'react';
import {HashRouter as Router, Route} from "react-router-dom";
import Dashboard from "./Common/Dashboard";
import DetailedDashboard from "./Common/DetailedDashboard";


function App() {
    return (
        <Router>

            <switch>
                <Route path="/" exact component={Dashboard}/>
                <Route  path='/detailed' exact component={DetailedDashboard}/>


            </switch>
        </Router>
    );
}

export default App;
