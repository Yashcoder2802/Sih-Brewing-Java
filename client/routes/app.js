import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';

function App() {
    return (
        <Router>
            <Navbar />
            <div style={{ padding: '20px' }}>
                <Switch>
                    <Route path="/" exact component={Dashboard} />
                    {/* Other routes will go here */}
                </Switch>
            </div>
        </Router>
    );
}

export default App;
