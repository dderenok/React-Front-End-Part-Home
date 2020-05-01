import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import NavigationBar from './components/NavigationBar';
import HomeBlock from './components/HomeBlock';
import Rooms from './components/Rooms';
import Footer from './components/Footer';
import AddRoom from './components/AddRoom';
import Sensors from './components/Sensors';

function App() {
  return (
    <Router>
      <NavigationBar />
      <Switch>
        <Route path="/" exact component = { HomeBlock } />
        <Route path="/add-room" exact component = { AddRoom } />
        <Route path="/list-room" exact component = { Rooms } />
        <Route path="/sensors" exact component = { Sensors } />
      </Switch>
      <Footer />
    </Router>
  );
}

export default App;
