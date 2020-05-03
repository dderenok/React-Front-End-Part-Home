import React, { Component } from 'react';

import { Card, Button, Form, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusSquare, faList } from '@fortawesome/free-solid-svg-icons';
import OperationNotification from './OperationNotification.js'; 

import axios from 'axios';

export default class AddTemperature extends Component {

	constructor (props) {
		super(props);

		this.state = this.initialState;
		this.state.show = false
		this.nameChange = this.nameChange.bind(this);
		this.temperatureValueChange = this.temperatureValueChange.bind(this);
		this.roomSelectChange = this.roomSelectChange.bind(this);
		this.submitForm = this.submitForm.bind(this);
	}

	initialState = {
		name:'', 
		temperatureValue:'',
		roomGuid: '',
		availableRoom: []
	}

	async componentDidMount() {
		await axios.get("http://localhost:8081/room/available-rooms")
			.then(({data}) => {
				console.log(data)
				this.setState({
					availableRoom: data
				})
			})
	}

	submitForm(event) {
		console.log(this.state.roomGuid)
		console.log(this.state.availableRoom)
		let temperatureSensor = {
			name: this.state.name,
			temperatureValue: this.state.temperatureValue,
			roomGuid: this.state.roomGuid
		}

		console.log(temperatureSensor)
		debugger

		axios.post("http://localhost:8082/temperature", temperatureSensor)
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

	temperatureValueChange(event) {
		this.setState({
			temperatureValue: event.target.value
		})
	}

	roomSelectChange = (event) => {
		if (event.target.value !== "Choose necessary room...") {
			this.setState({
				roomGuid: event.target.value
			});
		} else {
			this.setState({
				roomGuid: ''
			});
		}
	}

	backToSensorList = () => {
		return this.props.history.push("/sensors");
	}

	render() {
		const { roomGuid, availableRoom } = this.state
		return (
			<div>
				<div style = {{ "display": this.state.show ? "block" : "none" }}>
					<OperationNotification show = { this.state.show } message = { "Temperature sensor was created succesfully." } type = { "success" }/>
				</div>
				<Card>
					<Card.Header><FontAwesomeIcon icon={ faPlusSquare } />Add Temperature sensor</Card.Header>
					<Form onSubmit={this.submitForm} id="room-form">
						<Card.Body>
						 	<Form.Row>
						 		<Form.Group as={ Col } controlId="formControlName">
							    <Form.Label>Name of Temperature sensor</Form.Label>
							    <Form.Control required
							    	type="text" name="name"
							    	value={this.state.name}
							    	onChange={this.nameChange}
							    	className={"bg-light text-black"}
							    	placeholder="Enter Name for Temperature sensor" />
							  </Form.Group>

							  <Form.Group as={ Col } controlId="formControlTemperature">
							    <Form.Label>Default Temperature</Form.Label>
							    <Form.Control required
							    	type="number" name="temperature"
							    	value={this.state.temperatureValue}
							    	onChange={this.temperatureValueChange}
							    	className={"bg-light text-black"}
							    	placeholder="Enter Default Temerature for sensor" />
							  </Form.Group>

							  <Form.Group as={Col} controlId="formGridState">
							      <Form.Label>Attach to room</Form.Label>

							      <Form.Control 
							      	as="select" 
							      	custom={roomGuid}
							      	onChange={(e) => this.roomSelectChange(e)}
							      	value={roomGuid}>
							      	<option>Choose necessary room...</option>
							      	{ availableRoom.map((room) => {
							      		return(
							      			<option key={room.guid} value={room.guid}>
							      				{room.name}
							      			</option>
							      		)
							      	})}
							      </Form.Control>
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
