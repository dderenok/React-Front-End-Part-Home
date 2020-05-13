import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import NavigationBar from './components/NavigationBar';
import HomeBlock from './components/HomeBlock';
import Rooms from './components/Rooms';
import Footer from './components/Footer';
import AddRoom from './components/AddRoom';
import EditRoom from './components/EditRoom';
import Sensors from './components/Sensors';
import AddTemperature from './components/AddTemperature';
import AddLight from './components/AddLight';
import EditLight from './components/EditLight';
import EditTemperature from './components/EditTemperature';
import RoomInfo from './components/RoomInfo';

function App() {
  return (
    <Router>
      <NavigationBar />
      <Switch>
        <Route path="/" exact component = { HomeBlock } />
        <Route path="/add-room" exact component = { AddRoom } />
        <Route path="/edit-room/:guid" exact component = { EditRoom } />
        <Route path="/list-room" exact component = { Rooms } />
        <Route path="/sensors" exact component = { Sensors } />
        <Route path="/add-temperature" exact component = { AddTemperature } />
        <Route path="/add-light" exact component = { AddLight } />
        <Route path="/edit-light/:guid" exact component = { EditLight } />
        <Route path="/edit-temperature/:guid" exact component = { EditTemperature } />
        <Route path="/room-info/:guid" exact component = { RoomInfo } />
      </Switch>
      <Footer />
    </Router>
  );
}

export default App;
