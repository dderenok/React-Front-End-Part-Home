import React, { Component } from 'react';

import { Card, Button, Form, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusSquare, faList } from '@fortawesome/free-solid-svg-icons';
import OperationNotification from './OperationNotification.js'; 

import axios from 'axios';

export default class AddLight extends Component {

	constructor (props) {
		super(props);

		this.state = this.initialState;
		this.state.show = false
		this.nameChange = this.nameChange.bind(this);
		this.submitForm = this.submitForm.bind(this);
	}

	initialState = {
		name:''
	}

	async submitForm(event) {
		let lightSensor = {
			name: this.state.name
		}

		console.log(lightSensor)

		await axios.post("http://localhost:8083/light", lightSensor)
			.then(response => {
				console.log(response);
				if (response.data != null) {
					this.setState({"show": true})
					setTimeout(() => this.setState({"show": false}), 3000)
				} else {
					this.setState({"show": false})
				}
			});

		this.setState(this.initialState)
	}

	nameChange(event) {
		this.setState({
			name: event.target.value
		});
	}

	backToSensorList = () => {
		return this.props.history.push("/sensors");
	}

	render() {
		return (
			<div>
				<div style = {{ "display": this.state.show ? "block" : "none" }}>
					<OperationNotification show = { this.state.show } message = { "Light sensor was created succesfully." } type = { "success" }/>
				</div>
				<Card>
					<Card.Header><FontAwesomeIcon icon={ faPlusSquare } /> Add Light sensor</Card.Header>
					<Form onSubmit={this.submitForm} id="room-form">
						<Card.Body>
						 	<Form.Row>
						 		<Form.Group as={ Col } controlId="formControlName">
							    <Form.Label>Name of Light sensor</Form.Label>
							    <Form.Control required
							    	type="text" name="name"
							    	value={this.state.name}
							    	onChange={this.nameChange}
							    	className={"bg-light text-black"}
							    	placeholder="Enter Name for Light sensor" />
							  </Form.Group>
						 	</Form.Row>
						</Card.Body>

						<Card.Footer>
							<Button size="sm" variant="info" type="button" onClick = {this.backToSensorList.bind()} >
						    	<FontAwesomeIcon icon={ faList } /> Back to sensor list
						  	</Button>
							<Button size="sm" variant="success" type="button" onClick = {this.submitForm}>
						    	Create
						  	</Button>
						</Card.Footer>
					</Form> 
				</Card>
			</div>
		)
	}
}
