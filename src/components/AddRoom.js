import React, { Component } from 'react';

import { Card, Button, Form, Col } from 'react-bootstrap';
import InputGroup from 'react-bootstrap/InputGroup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusSquare, faList } from '@fortawesome/free-solid-svg-icons';
import OperationNotification from './OperationNotification.js'; 

import axios from 'axios';

import '../styles/add-room.scss';

export default class AddRoom extends Component {

	constructor (props) {
		super(props);

		this.state = this.initialState;
		this.state.show = false
		this.nameChange = this.nameChange.bind(this);
		this.temperatureSelectChange = this.temperatureSelectChange.bind(this);
		this.lightSelectChange = this.lightSelectChange.bind(this);
		this.submitForm = this.submitForm.bind(this);
	}

	initialState = {
		name: '',
		temperatureGuid: '',
		lightGuid: '',
		temperatureSensors: [],
		lightSensors: [],
		lightSensorGuids: []
	}

	componentDidMount() {
		this.getTemperatureSensors()
		this.getLightSensors()
	}

	getTemperatureSensors = async => {
		axios.get("http://localhost:8082/temperature/attach-available")
			.then(({ data }) => {
				
				this.setState({
					temperatureSensors: data,
				})
			});
	}

	getLightSensors = async => {
		axios.get("http://localhost:8083/light/available-to-attach")
			.then(({ data }) => {
				this.setState({
					lightSensors: data,
				})
			});
	}

	submitForm = event => {
		let chosenSensors = this.state.lightSensorGuids.map(function (lightGuid) {
			return {
				guid: lightGuid,
				type: "LIGHT"
			}
		})
		if (this.state.temperatureGuid !== '') {
			let temperatureSensor = {
				guid: this.state.temperatureGuid,
				type: "TEMPERATURE"
			}
			chosenSensors.push(temperatureSensor)
		}
		
		console.log(chosenSensors)
		const room = {
			name: this.state.name,
			sensors: chosenSensors
		}
		axios.post("http://localhost:8081/room", room)
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
		this.getTemperatureSensors()
		this.getLightSensors()
	}

	nameChange = (event) => {
		this.setState({
			name: event.target.value
		});
	}

	temperatureSelectChange = (event) => {
		if (event.target.value !== "Choose necessary temperature sensor...") {
			this.setState({
				temperatureGuid: event.target.value
			});
		} else {
			this.setState({
				temperatureGuid: ''
			});
		}
		
	}

	lightSelectChange = (event) => {
		let value = Array.from(event.target.selectedOptions, option => option.value);
		this.setState({
			lightSensorGuids: value
		})
	}

	roomList = () => {
		return this.props.history.push("/list-room");
	}

	render() {
		const { name, temperatureSensors, temperatureGuid, lightGuid, lightSensors, lightSensorGuids } = this.state;
		return (
			<div>
				<div style = {{ "display": this.state.show ? "block" : "none" }}>
					<OperationNotification show = {this.state.show} message = {"Room saved succesfully."} type = {"success"}/>
				</div>

				<Card>
					<Card.Header>
							Add new room
					</Card.Header>
					<Form onSubmit={this.submitForm} id="room-form">
						<Card.Body>
					 		<Form.Group as={ Col } controlId="formControlName">
							    <Form.Label>Room Name</Form.Label>
							    <Form.Control required autoComplete="off"
							    	type="text" name="name"
							    	value={name}
							    	onChange={(e) => this.nameChange(e)}
							    	className={"bg-light text-black"}
							    	placeholder="Enter Room Name" />
						  	</Form.Group>

						  	<Form.Group as={Col} controlId="formGridState">
						      <Form.Label>Temperature sensor</Form.Label>

						      <Form.Control 
						      	as="select" 
						      	custom={temperatureGuid}
						      	onChange={(e) => this.temperatureSelectChange(e)}
						      	value={temperatureGuid}>
						      	<option>Choose necessary temperature sensor...</option>
						      	{ temperatureSensors.map((tempeatureSensor) => {
						      		return(
						      			<option key={tempeatureSensor.guid} value={tempeatureSensor.guid}>
						      				{tempeatureSensor.name}
						      			</option>
						      		)
						      	})}
						      </Form.Control>
						    </Form.Group>

							<Form.Group as={Col} controlId="formGridState">
						        <Form.Label>Light sensor</Form.Label>

						        <Form.Control 
						      	  as="select" 
						      	  multiple
						      	  custom={lightSensorGuids}
						      	  onChange={(e) => this.lightSelectChange(e)}
						      	  value={lightSensorGuids}>
						      	  { lightSensors.map((lightSensor) => {
						      		return(
						      		 	<option key={lightSensor.guid} value={lightSensor.guid}>
						      				{lightSensor.name}
						      			</option>
						      		)
						      	  })}
						        </Form.Control>
						    </Form.Group>
						</Card.Body>

						<Card.Footer>
							<Button size="sm" variant="btn-sm btn-outline-primary room-list-btn" type="button" onClick = {this.roomList.bind()} >
						    	<FontAwesomeIcon icon={ faList } /> Room list
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
