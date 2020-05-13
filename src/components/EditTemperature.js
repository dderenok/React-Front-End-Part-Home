import React, { Component } from 'react';

import { Card, Button, Form, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import OperationNotification from './OperationNotification.js'; 

import axios from 'axios';

export default class EditTemperature extends Component {

	constructor (props) {
		super(props);

		this.state = this.initialState;
		this.state.show = false
		this.nameChange = this.nameChange.bind(this);
		this.nameChangeHandler = this.nameChangeHandler.bind(this)
		this.temperatureValueChange = this.temperatureValueChange.bind(this)
		this.temperatureValueChangeHandler = this.temperatureValueChangeHandler.bind(this)
	}

	initialState = {
		name: '',
		temperatureValue: '',
		roomGuid: '',
		alreadyAttached: false,
		availableRoom: [],
		formErrors: {name: '', temperatureValue: ''},
		nameValid: false,
		temperatureValueValid: false,
		formValid: false
	}
	
	componentDidMount() {
		this.getTemperatureInfo()
	}

	getTemperatureInfo() {
		axios.get("http://localhost:8082/temperature/" + this.props.match.params.guid)
			.then(response => {
				if (response.data != null) {
					this.setState({
						name: response.data.name,
						temperatureValue: response.data.temperatureValue,
						roomGuid: response.data.roomGuid,
					})
				}
				if (response.data.roomGuid !== null) {
					this.setState({
						alreadyAttached: true
					})
				}
				this.getRoomsInfo()
			}).catch((error) => console.log(error))
	}

	getRoomsInfo() {
		if (this.state.roomGuid === null) {
			axios.get("http://localhost:8081/room/available-rooms/temperature")
				.then(({data}) => {
					this.setState({
						availableRoom: data
					})
				})
		}
	}

	nameChangeHandler() {
		if (this.state.name.length !== 0) {
			this.setState({
				formErrors: {
					name: ''
				}
			})
			let temperatureInfo = {
				name: this.state.name,
				temperatureValue: this.state.temperatureValue
			}

			axios.put("http://localhost:8082/temperature/" + this.props.match.params.guid, temperatureInfo)
					.then(response => {
						if (response.data != null) {
							this.setState({
								"show": true,
								"showMessage": "Temperature name: " + response.data.name + ", was succesfully updated."
							})
							setTimeout(() => this.setState({"show": false}), 3000)
							
						} else {
							this.setState({"show": false})
						}
					})

		}
	}

	temperatureValueChangeHandler() {
		if (this.state.temperatureValue >= 15 && this.state.temperatureValue <= 30) {
			let temperatureInfo = {
				temperatureValue: this.state.temperatureValue
			}
			axios.put("http://localhost:8082/temperature/" + this.props.match.params.guid, temperatureInfo)
					.then(response => {
						if (response.data != null) {
							this.setState({
								"show": true,
								"showMessage": "Temperature value: " + response.data.temperatureValue + ", was succesfully updated."
							})
							setTimeout(() => this.setState({"show": false}), 3000)
							
						} else {
							this.setState({"show": false})
						}
					})
		}
		
	}

	temperatureRoomValueHandler() {
		if (this.state.roomGuid !== null) {
			let temperatureInfo = {
				temperatureValue: this.state.temperatureValue,
				roomGuid: this.state.roomGuid
			}

			axios.put("http://localhost:8082/temperature/" + this.props.match.params.guid, temperatureInfo)
				.then(response => {
					if (response.data != null) {
						this.setState({
							"show": true,
							"showMessage": "Temperature was attached to room succesfully.",
							alreadyAttached: true
						})
						setTimeout(() => this.setState({"show": false}), 3000)
						
					} else {
						this.setState({"show": false})
					}
				})
		}
		
	}

	nameChange(event) {
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
		this.setState({
			name: event.target.value
		});
	}

	temperatureValueChange(event) {
		console.log(event.target.value)
		if (event.target.value > 30 || event.target.value < 15) {
			this.setState({
				formErrors: {
					temperatureValue: "Temperature value desirable to have in range from 15 to 30 degress."
				}
			})
		} else {
			this.setState({
				formErrors: {
					name: ''
				}
			})
		}
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
		const { formErrors, roomGuid, availableRoom, alreadyAttached } = this.state
		return (
			<div>
				<div style = {{ "display": this.state.show ? "block" : "none" }}>
					<OperationNotification show = { this.state.show } message = { this.state.showMessage } type = { "success" }/>
				</div>
				<Card>
					<Card.Header>Temperature sensor information</Card.Header>
					<Form noValidate id="room-form">
						<Card.Body>
						 		<Form.Group as={ Col } controlId="formControlName">
							    <Form.Label>Name of Temperature sensor</Form.Label>
							    <Form.Control required autoComplete="off"
							    	type="text" name="name"
							    	value={this.state.name}
							    	onChange={this.nameChange}
							    	className={"bg-light text-black"}
							    	placeholder="Enter Name for Light sensor"
							    	onBlur = {this.nameChangeHandler.bind(this)}
							    	isInvalid={!!formErrors.name} />

							    <Form.Control.Feedback type="invalid">
					               {formErrors.name}
					            </Form.Control.Feedback>
							  </Form.Group>

							  <Form.Group as={ Col } controlId="formControlTemperature">
							    <Form.Label>Temperature value</Form.Label>
							    <Form.Control required autoComplete="off"
							    	type="number" name="temperature"
							    	value={this.state.temperatureValue}
							    	onChange={this.temperatureValueChange}
							    	className={"bg-light text-black"}
							    	placeholder="Enter Default Temerature for sensor"
							    	onBlur = {this.temperatureValueChangeHandler.bind(this)}
							    	isInvalid={!!formErrors.temperatureValue} />

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

							{ alreadyAttached === false ? 
							  	<Form.Group as={Col} controlId="formGridState">
							      <Form.Label>Attach to room</Form.Label>

							      <Form.Control 
							      	as="select" 
							      	custom={roomGuid}
							      	onChange={(e) => this.roomSelectChange(e)}
							      	value={roomGuid}
							      	onBlur = {this.temperatureRoomValueHandler.bind(this)}
							      	>
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
							    :
							    <p>This sensor already attached to room.</p>
							}
						</Card.Body>

						<Card.Footer>
							<Button size="sm" variant="info" type="button" onClick = {this.backToSensorList.bind()} >
						    	<FontAwesomeIcon icon={ faList } /> Back to sensor list
						  	</Button>
						</Card.Footer>
					</Form> 
				</Card>
			</div>
		)
	}
}
