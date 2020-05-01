import React, { Component } from 'react';

import { Card, Button, Form, Col } from 'react-bootstrap';
import InputGroup from 'react-bootstrap/InputGroup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import CreateNotification from './CreateNotification.js'; 

import axios from 'axios';

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
		axios.get("http://localhost:8082/temperature")
			.then(({ data }) => {
				this.setState({
					temperatureSensors: data,
				})

				if (data[0] !== null) {
					this.setState({
						temperatureGuid: data[0].guid
					})
				}
			});
	}

	getLightSensors = async => {
		axios.get("http://localhost:8083/light")
			.then(({ data }) => {
				this.setState({
					lightSensors: data,
				})
			});
	}

	submitForm = event => {
		let temperatureSensor = {
			guid: this.state.temperatureGuid,
			type: "TEMPERATURE"
		}
		let chosenSensors = this.state.lightSensorGuids.map(function (lightGuid) {
			return {
				guid: lightGuid,
				type: "LIGHT"
			}
		})

		chosenSensors.push(temperatureSensor)
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
		this.setState({
			temperatureGuid: event.target.value
		});
	}

	lightSelectChange = (event) => {
		let value = Array.from(event.target.selectedOptions, option => option.value);
		this.setState({
			lightSensorGuids: value
		})
	}

	render() {
		const { name, temperatureSensors, temperatureGuid, lightGuid, lightSensors, lightSensorGuids } = this.state;
		return (
			<div>
				<div style = {{ "display": this.state.show ? "block" : "none" }}>
					<CreateNotification children = {{show: this.state.show, message: "Room saved succesfully."}}/>
				</div>

				<Card>
					<Card.Header>
						<FontAwesomeIcon icon={ faPlusSquare } /> 
							Add Room
					</Card.Header>
					<Form onSubmit={this.submitForm} id="room-form">
						<Card.Body>
						 	<Form.Row>
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
						 	</Form.Row>
						</Card.Body>

						<Card.Footer>
							<Button size="sm" variant="success" type="button" onClick = {this.submitForm}>
						    	Submit
						  	</Button>
						</Card.Footer>
					</Form> 
				</Card>
			</div>

			
		)
	}
}
