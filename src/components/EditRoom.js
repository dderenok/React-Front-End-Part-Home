import React, { Component } from 'react';

import { Card, Button, Form, Col, Row } from 'react-bootstrap';
import ListGroup from 'react-bootstrap/ListGroup'
import InputGroup from 'react-bootstrap/InputGroup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faList, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import OperationNotification from './OperationNotification.js'; 
import axios from 'axios';

import '../styles/edit-room.scss';

export default class EditRoom extends Component {

	constructor (props) {
		super(props);

		this.state = this.initialState;
		this.state.show = false
		this.state.showMessage = ''
		this.nameChange = this.nameChange.bind(this);
		this.temperatureSelectChange = this.temperatureSelectChange.bind(this);
		this.lightSelectChange = this.lightSelectChange.bind(this);
		this.nameChangeHandler = this.nameChangeHandler.bind(this)
	}

	initialState = {
		guid: '',
		name: '',
		temperatureGuid: '',
		temperatureSensors: [],
		roomTemperatureSensor: [],
		chosenTemperature: {},
		abilityForAddingTemperatureSensors: false,
		temperatureLoader: false,
		lightGuid: '',
		lightSensors: [],
		lightSensorGuids: [],
		roomLightSensors: [],
		chosenLightSensors: [],
		abilityForAddingLightSensors: false
	}

	async componentDidMount() {
		console.log(this.props.match.params.guid);
		const roomGuid = this.props.match.params.guid;
		if (roomGuid !== null) {
			await this.getRoomInformationByGuid(roomGuid)
		}
		await this.getTemperatureSensors()
		await this.getLightSensors()
	}

	async getRoomInformationByGuid(roomGuid) {
		console.log(roomGuid)
		await axios.get("http://localhost:8081/room/" + roomGuid)
			.then(response => {
				console.log(response)
				if (response.data !== null) {
					this.setState({
						guid: response.data.guid,
						name: response.data.name,
						roomTemperatureSensor: response.data.sensors.filter((sensor) => {
							if (sensor.type === "TEMPERATURE") {
								return sensor
							}
						}),
						roomLightSensors: response.data.sensors.filter((sensor) => {
							if (sensor.type === "LIGHT") {
								return sensor
							}
						}),
					});
				}
			}).catch((error) => console.log(error))
	}

 	async getTemperatureSensors() {
 		if (this.state.roomTemperatureSensor.length > 0) {
				await axios.get("http://localhost:8082/temperature/"+this.state.roomTemperatureSensor[0].guid)
					.then(({data}) => {
						this.setState({
							chosenTemperature: data,
							temperatureLoader: true
						})
					})
				} else {
					this.state.chosenTemperature = {}
				}
		await axios.get("http://localhost:8082/temperature/attach-available")
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

	async getLightSensors() {
		let lightSensorGuids = this.state.roomLightSensors.map(sensor => sensor.guid)
		console.log(lightSensorGuids)
		var params = new URLSearchParams();
		params.append("guids", lightSensorGuids)
		if (this.state.roomLightSensors.length > 0) {
			axios.get("http://localhost:8083/light/list", { params: params })
				.then(({ data }) => {
					this.setState({
						chosenLightSensors: data
					})
					console.log(this.state.chosenLightSensors)
			})
		}
		await axios.get("http://localhost:8083/light/available-to-attach")
			.then(({ data }) => {
				this.setState({
					lightSensors: data,
				})
			});
	}

	async removeSensorFromRoom(sensorGuid) {
		await axios.get("http://localhost:8081/room/remove-sensor/" + sensorGuid)
				.then(response => {
					if (response.data != null) {
						this.setState({
							"show": true,
							"showMessage": "Light sensor was removed from room succesfully."
						})
						setTimeout(() => this.setState({"show": false}), 3000)
						this.setState({
							chosenLightSensors: this.state.chosenLightSensors.filter(lightSensor => lightSensor.guid !== sensorGuid)
						})
					} else {
						this.setState({"show": false})
					}
				})
	}

	async removeAllSensorsFromRoom() {
		let lightSensors = this.state.chosenLightSensors.map(function(sensor) {
			return {
				guid: sensor.guid,
				type: "LIGHT"
			}
		})
		console.log(lightSensors)
		debugger
		await axios.put("http://localhost:8081/room/remove-sensors", lightSensors)
				.then(response => {
					if (response.data != null) {
						this.setState({
							"show": true,
							"showMessage": "All light sensors was removed from room succesfully."
						})
						setTimeout(() => this.setState({"show": false}), 3000)
						this.setState({
							chosenLightSensors: []
						})
					} else {
						this.setState({"show": false})
					}
				})
	}

	async nameChangeHandler() {
		let roomInfo = {
			name: this.state.name,
			sensors: []
		}
		await axios.put("http://localhost:8081/room/" + this.props.match.params.guid, roomInfo)
				.then(response => {
					if (response.data != null) {
						this.setState({
							"show": true,
							"showMessage": "Room name was succesfully updated."
						})
						setTimeout(() => this.setState({"show": false}), 3000)
						
					} else {
						this.setState({"show": false})
					}
				})
	}

	async sensorChangeHandler() {
		let chosenSensors = this.state.lightSensorGuids.map(function (lightGuid) {
			return {
				guid: lightGuid,
				type: "LIGHT"
			}
		})
		let roomInfo = {
			sensors: chosenSensors
		}

		await axios.put("http://localhost:8081/room/" + this.props.match.params.guid, roomInfo)
				.then(response => {
					if (response.data != null) {
						this.setState({
							"show": true,
							"showMessage": "New light sensors was succesfully added to room."
						})
						setTimeout(() => this.setState({"show": false}), 3000)
					} else {
						this.setState({"show": false})
					}
				})
	}

	async temperatureSensorChangeHandler() {
		console.log(this.state.temperatureGuid)
		console.log(this.state.chosenTemperature)
		console.log(this.state.chosenTemperature.guid == undefined)
		let sensorGuids = [this.state.chosenTemperature.guid]

		let chosenSensors = {
			guid: this.state.temperatureGuid,
			type: "TEMPERATURE"
		}
		console.log(chosenSensors)

		let roomInfo = {
			sensors: [chosenSensors]
		}
		if (sensorGuids.length > 0 && this.state.chosenTemperature.guid != undefined) {
			axios.all([
			    axios.put("http://localhost:8081/room/remove-sensors", sensorGuids),
			    axios.put("http://localhost:8081/room/" + this.props.match.params.guid, roomInfo)
		    ])
		    .then(axios.spread((removeResponse, updateResponse) => {
		    	console.log(removeResponse)
		    	console.log(updateResponse)
		    }))
		} else {
		    axios.put("http://localhost:8081/room/" + this.props.match.params.guid, roomInfo)
			    .then((removeResponse) => {
			    	console.log(removeResponse)
			    })
		}
		
	}

	addNewTemperatureSensor() {
		this.temperatureSensorChangeHandler()
		window.location.reload(false);
		this.addAbilityForAddingLightSensors(false)
	}

	addNewLightSensors() {
		this.sensorChangeHandler()
		window.location.reload(false);
		this.addAbilityForAddingLightSensors(false)
	}
	
	findChosenLightSensors(roomLightSensors, lightSensors) {
	  	var chosenLightSensors = [];
	  	var chosenLightIndexes = []
	  	for (var roomLightSensor in roomLightSensors) {
	  		for(var lightSensor in lightSensors) {   
		        if (roomLightSensors[roomLightSensor].guid === lightSensors[lightSensor].guid && !chosenLightSensors.includes(lightSensors[lightSensor])){
		            chosenLightSensors.push(lightSensors[lightSensor]);
		            chosenLightIndexes.push(false)
		        }
	    	}
	  	}

	  	this.setState({
	  		selectedLightIndexes: chosenLightIndexes
	  	})
    	
    	return chosenLightSensors;
	}

	nameChange = (event) => {
		this.setState({
			name: event.target.value
		});
	}

	temperatureSelectChange = (event) => {
		console.log("TEMPERATURE EVENT")
		this.setState({
			temperatureGuid: event.target.value
		});
	}

	lightSelectChange = (event) => {
		console.log("LIGHT EVENT")
		let value = Array.from(event.target.selectedOptions, option => option.value);
		this.setState({
			lightSensorGuids: value
		})
	}

	addAbilityForAddingLightSensors(needToAddSensor) {
		this.setState({
			abilityForAddingLightSensors: needToAddSensor
		})
	}

	addAbilityForAddingTemperatureSensors(needToAddSensor) {
		this.setState({
			abilityForAddingTemperatureSensors: needToAddSensor
		})
	}

	roomList = () => {
		return this.props.history.push("/list-room");
	}

	render() {
		const { 
			name,
			temperatureSensors, 
			temperatureGuid, 
			chosenTemperature,
			abilityForAddingTemperatureSensors,
			temperatureLoader,
			lightGuid, 
			lightSensors, 
			lightSensorGuids,
			chosenLightSensors,
			abilityForAddingLightSensors
		} = this.state;

		return (
			<div>
				<div style = {{ "display": this.state.show ? "block" : "none" }}>
					<OperationNotification show = {this.state.show} message = {this.state.showMessage ? this.state.showMessage : "Room updated succesfully."} type = {"success"}/>
				</div>

				<Card>
					<Card.Header>
						<FontAwesomeIcon icon={ faInfoCircle } /> 
							Room information 
					</Card.Header>
					<Form onSubmit={this.submitForm} id="room-form">
						<Card.Body>
					 		<Form.Group as={ Row } controlId="formControlName">
							    <Form.Label column sm = "3"><p>Room Name:</p></Form.Label>
							    <Col sm = "9">
									<Form.Control required autoComplete="off"
								    	type="text" name="name"
								    	value={name}
								    	onChange={(e) => this.nameChange(e)}
								    	className={"bg-light text-black"}
								    	placeholder="Enter Room Name"
								    	onBlur = {this.nameChangeHandler.bind(this)} />
							    </Col>
						  	</Form.Group>

						  	{ abilityForAddingTemperatureSensors === true ? 
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
								    <Button size = "sm" variant = "primary" type = "button" onClick = {this.addNewTemperatureSensor.bind(this)}>
						        		Replace with old sensor
						        	</Button>
						        	<Button size = "sm" variant = "secondary" type = "button" onClick = {this.addAbilityForAddingTemperatureSensors.bind(this, false)}>
						        		Cancel
						        	</Button>
							    </Form.Group>
							    :
							    <Form.Group as={ Row } controlId="formGridState">
							        <Form.Label column sm = "3">Temperature sensor: </Form.Label>
							        <Col sm = "3">
							        	<a href="#">{temperatureLoader === true ? chosenTemperature.name : ""}</a>
							        </Col>
							        <Col sm = "6">
							        	<Button size = "sm" variant = "secondary" type = "button" onClick = {this.addAbilityForAddingTemperatureSensors.bind(this, true)}>
							        		Choose another
							        	</Button>
							        </Col>
						    	</Form.Group>
						    }

							<Form.Group as={ Row } controlId="formGridState">
						        <Form.Label column sm = "3">Light sensors:</Form.Label>
						        <Col sm = "5">
							        <ListGroup>
								        { chosenLightSensors.map((lightSensor) => {
								        	return (
								        		<ListGroup.Item key = {lightSensor.guid} className = "light-list-element">
								        		 	<a href = "#">{lightSensor.name}</a>
								        		 	<Button size = "sm" variant = "danger" type = "button" onClick = {this.removeSensorFromRoom.bind(this, lightSensor.guid)}>
								        		 		Remove from room
								        		 	</Button>
								        		</ListGroup.Item>
							        		)
										})}
									</ListGroup>
								</Col>
								<Col sm = "4" className = "light-operation-group-btn">
									{ chosenLightSensors.length !== 0 ? 
										abilityForAddingLightSensors === true ? 
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
								        		<Button size = "sm" variant = "primary" type = "button" onClick = { this.addNewLightSensors.bind(this) }>
								        			Add selected
								        		</Button>
								        		<Button size = "sm" variant = "secondary" type = "button" onClick = { this.addAbilityForAddingLightSensors.bind(this, false) }>
								        			Cancel
								        		</Button>
								    		</Form.Group> 
							    			:
											<div>	
												<Button size = "sm" variant = "danger" type = "button" onClick = {this.removeAllSensorsFromRoom.bind(this)}>
													Remove all
												</Button>
												<Button size = "sm" variant = "primary" type = "button" onClick = { this.addAbilityForAddingLightSensors.bind(this, true) }>
													Add available light sensors
												</Button> 
										</div>
									: 
									<div>
										{ abilityForAddingLightSensors === true ? 
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
								        		<Button size = "sm" variant = "primary" type = "button" onClick = { this.addNewLightSensors.bind(this) }>
								        			Add selected
								        		</Button>
								        		<Button size = "sm" variant = "secondary" type = "button" onClick = { this.addAbilityForAddingLightSensors.bind(this, false) }>
								        			Cancel
								        		</Button>
								    		</Form.Group> 
							    			:
								    		<Button size = "sm" variant = "primary" type = "button" onClick = { this.addAbilityForAddingLightSensors.bind(this, true) }>
												Add available light sensors
											</Button>
										}
									</div>
									}
								</Col>
					    	</Form.Group>
						</Card.Body>

						<Card.Footer>
							<Button size="sm" variant="info" type="button" onClick = {this.roomList.bind()} >
						    	<FontAwesomeIcon icon={ faList } /> Room list
						  	</Button>
						</Card.Footer>
					</Form> 
				</Card>
			</div>
		)
	}
}
