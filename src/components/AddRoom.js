import React, { Component } from 'react';

import { Card, Button, Form, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons';

export default class AddRoom extends Component {

	constructor (props) {
		super(props);

		this.state = {
			name:'', 
			temperature:''
		};

		this.roomChange = this.roomChange.bind(this);
		this.submitForm = this.submitForm.bind(this);
	}

	submitForm(event) {
		alert("Room Name: " + this.state.name + " Room Temperature: " + this.state.temperature);

		this.preventDefault();
	}

	roomChange(event) {
		this.setState({
			[event.target.name]:event.target.value
		});
	}

	render() {
		return (
			<Card>
				<Card.Header><FontAwesomeIcon icon={ faPlusSquare } /> Add Room</Card.Header>
				<Form onSubmit={this.submitForm} id="room-form">
					<Card.Body>
					 	<Form.Row>
					 		<Form.Group as={ Col } controlId="formControlName">
						    <Form.Label>Room Name</Form.Label>
						    <Form.Control required
						    	type="text" name="name"
						    	value={this.state.name}
						    	onChange={this.roomChange}
						    	className={"bg-light text-black"}
						    	placeholder="Enter Room Name" />
						  </Form.Group>

						  <Form.Group as={ Col } controlId="formControlTemperature">
						    <Form.Label>Default Temperature</Form.Label>
						    <Form.Control required
						    	type="number" name="temperature"
						    	value={this.state.temperature}
						    	onChange={this.roomChange}
						    	className={"bg-light text-black"}
						    	placeholder="Enter Room Temerature" />
						  </Form.Group>

					 	</Form.Row>
					</Card.Body>

					<Card.Footer>
						<Button size="sm" variant="success" type="submit">
					    Submit
					  </Button>
					</Card.Footer>
				</Form> 
			</Card>
		)
	}
}
