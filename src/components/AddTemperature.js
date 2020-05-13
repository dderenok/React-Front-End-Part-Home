import React, { Component } from 'react';

import { Card, Button, Form, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusSquare, faList } from '@fortawesome/free-solid-svg-icons';
import OperationNotification from './OperationNotification.js'; 

import axios from 'axios';
import '../styles/add-temperature.scss';

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
		availableRoom: [],
		formErrors: {name: '', temperatureValue: ''},
		nameValid: false,
		temperatureValueValid: false,
		formValid: false
	}

	async componentDidMount() {
		await axios.get("http://localhost:8081/room/available-rooms/temperature")
			.then(({data}) => {
				console.log(data)
				this.setState({
					availableRoom: data
				})
			})
	}

	submitForm(event) {
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

	nameChangeHandler(event) {
		this.setState({
			name: event.target.value
		});
		if (event.target.value.length === 0) {
			this.setState({
				formErrors: {
					name: "Name value cannot be empty."
				}
			})
		} else {
			this.setState({
				formErrors: {
					name: ''
				}
			})
		}
	}

	temperatureChangeHandler(event) {
		this.setState({
			temperatureValue: event.target.value
		})
		if (this.state.temperatureValue < 15 || this.state.temperatureValue > 30) {
			console.log("1")
			this.setState({
				formErrors: {
					temperatureValue: "Temperature value desirable to have in range from 15 to 30 degress."
				}
			})
		} else {
			this.setState({
				formErrors: {
					temperatureValue: ''
				}
			})
		}
	}

	backToSensorList = () => {
		return this.props.history.push("/sensors");
	}

	render() {
		const { roomGuid, availableRoom, formErrors, formValid } = this.state
		return (
			<div>
				<div style = {{ "display": this.state.show ? "block" : "none" }}>
					<OperationNotification show = { this.state.show } message = { "Temperature sensor was created succesfully." } type = { "success" }/>
				</div>
				<Card>
					<Card.Header>Add Temperature sensor</Card.Header>
					<Form onSubmit={this.submitForm} id="temperature-form">
						<Card.Body>
						 		<Form.Group as={ Col } controlId="formControlName">
							    <Form.Label>Name of Temperature sensor</Form.Label>
							    <Form.Control required
							    	type="text" name="name"
							    	value={this.state.name}
							    	onChange={this.nameChange}
							    	className={"bg-light text-black"}
							    	onBlur = {this.nameChangeHandler.bind(this)}
							    	isInvalid={!!formErrors.name}
							    	placeholder="Enter Name for Temperature sensor" />

							    <Form.Control.Feedback type="invalid">
					               {formErrors.name}
					            </Form.Control.Feedback>
							  </Form.Group>

							  <Form.Group as={ Col } controlId="formControlTemperature">
							    <Form.Label>Default Temperature</Form.Label>
							    <Form.Control required
							    	type="number" name="temperature"
							    	value={this.state.temperatureValue}
							    	onChange={this.temperatureValueChange}
							    	className={"bg-light text-black"}
							    	onBlur = {this.temperatureChangeHandler.bind(this)}
							    	isInvalid={!!formErrors.temperatureValue}
							    	placeholder="Enter Default Temerature for sensor" />

							     <Form.Control.Feedback type="invalid">
					               {formErrors.temperatureValue}
					            </Form.Control.Feedback>
					            { formErrors.temperatureValue === '' ? 
					            	<Form.Text className="text-muted">
								        For comfort mood use temperature value in range from 15 to 30 degress, please.
								    </Form.Text>
								    :<br />
								}
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
						</Card.Body>
						<Card.Footer>
							<Button size="sm" variant="info" type="button" onClick = {this.backToSensorList.bind()} >
						    	<FontAwesomeIcon icon={ faList } /> Back to sensor list
						  	</Button>
					  		<button className = "btn-sm btn-primary" onClick = {this.submitForm}>
						    	Create
						  	</button>
						</Card.Footer>
					</Form> 
				</Card>
			</div>
		)
	}
}
