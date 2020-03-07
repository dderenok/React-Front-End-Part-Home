import React, { Component } from 'react';
import '../styles/welcome.scss';

import { Jumbotron, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default class Welcome extends Component {
	render() {
		return (
			<Jumbotron className="welcome-block">
			  <h1>Welcome to the Smart Home management system web application!</h1>
			  <p>
			    This is the start page with buttons thanks to which 
			    you can create a room or enter sensor information into the system.
			  </p>
			  <div className="add-btn">
			    <Button variant="primary">
			    	<Link to={"add-room"} className="nav-link">Add New Room</Link>
			    </Button>
			    <Button variant="primary">
		      	<Link to={"add-sensor"} className="nav-link">Add New Sensor</Link>
		      </Button>
		     </div>
			</Jumbotron>	
		)
	}
}
