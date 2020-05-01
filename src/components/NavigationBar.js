import React, { Component } from 'react';
import '../styles/nav.scss'

import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouseDamage } from '@fortawesome/free-solid-svg-icons';

export default class NavigationBar extends Component {
	render () {
		return (
			<Navbar bg="light" variant="light">
				<Link to={""} className="navbar-brand">
					<FontAwesomeIcon icon={ faHouseDamage } /> 
					<span className="logo-name">Smart Home</span>
				</Link>
				<Nav className="mr-auto">
		      <Link to={"list-room"} className="nav-link">Rooms</Link>
		      <Link to={"add-room"} className="nav-link">Add Room</Link>
		      <Link to={"sensors"} className="nav-link">Sensors</Link>
  			</Nav>
			</Navbar>
		)
	}
}
