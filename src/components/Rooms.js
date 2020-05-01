import React, { Component } from 'react';
import { Card, Table, ButtonGroup, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import CreateNotification from './CreateNotification.js'; 
import axios from 'axios';

import '../styles/rooms.scss';

export default class Rooms extends Component {

	constructor(props) {
		super(props)
		this.state = this.initialState;
	};

	initialState = {
		rooms: [],
		temperatureSensorGuids: "",
		lightSensorGuids: "",
		temperatureSensors: [],
		lightSensors: []
	};

	parseSensorGuids() {
		for (let i = 0; i < this.state.rooms.length; i++) {
		    for (let j = 0; j < this.state.rooms[i].sensors.length ; j++) {
		        if (this.state.rooms[i].sensors[j].type === "TEMPERATURE" ) {
		            this.state.temperatureSensorGuids += this.state.rooms[i].sensors[j].guid + ","
		        } else if (this.state.rooms[i].sensors[j].type === "LIGHT" ) {
		            this.state.lightSensorGuids += this.state.rooms[i].sensors[j].guid + ","
		        } 
		    } 
		}
		this.state.temperatureSensorGuids = this.state.temperatureSensorGuids.substring(0, this.state.temperatureSensorGuids.length - 1)
		this.state.lightSensorGuids = this.state.lightSensorGuids.substring(0, this.state.lightSensorGuids.length - 1)
	};

	async componentDidMount() {
		await axios.get(
					"http://localhost:8081/room/all-rooms"
				).then(({ data }) => {
					this.setState({ 
						rooms: data
					})
					this.parseSensorGuids()
				})

		console.log(this.state.temperatureSensorGuids)
		console.log(this.state.lightSensorGuids)

		await axios.get(
					"http://localhost:8083/light/list", 
					{params: {guids: this.state.lightSensorGuids} 
				}).then(({ data }) => {
					this.setState({
						lightSensors: data
					})
				});

		await axios.get(
					"http://localhost:8082/temperature/list", 
					{params: {guids: this.state.temperatureSensorGuids} 
				}).then(({ data }) => {
					this.setState({
						temperatureSensors: data
					})
				});
	};

	deleteRoom = (roomGuid) => {
		axios.delete("http://localhost:8081/room/" + roomGuid)
			.then(response => {
				if (response.data != null) {
					this.setState({"show": true})
					setTimeout(() => this.setState({"show": false}), 3000)
					this.setState({
						rooms: this.state.rooms.filter(room => room.guid !== roomGuid)
					})
				} else {
					this.setState({"show": false})
				}
			})
	};

	render() {
		return (
			<div>
				<div style = {{ "display": this.state.show ? "block" : "none" }}>
					<CreateNotification children = {{show: this.state.show, message: "Room deleted succesfully.", type: "danger"}}/>
				</div>
				<Card>
					<Card.Header><FontAwesomeIcon icon={ faList } />
					 	List of rooms
					</Card.Header>
					<Card.Body>
						<Table bordered hover striped variant="light">
						  <thead>
						    <tr>
						      <th>Room Name</th>
						      <th>Temperature Sensor</th>
						      <th>Light Sensor</th>
						      <th>Action</th>
						    </tr>
						  </thead>
						  <tbody>
						  	{this.state.rooms.length === 0 ?
						  		<tr align="center">
						      		<td colSpan="6">No rooms available</td>
						    	</tr> :
						    	this.state.rooms.map((room) => (
						    		<tr key = {room.guid}>
						    			<td>{room.name}</td>
						    			<td>
						    				<Card className="sensor-card">
						    					<Card.Body>
					    							{ this.state.temperatureSensors.map(temperatureSensor => {

					    								for (var i = 0; i < room.sensors.length; i++) {
					    									if (room.sensors[i].guid == temperatureSensor.guid) return <Card.Text key = {temperatureSensor.guid}>
					    										Temperature of {temperatureSensor.name} sensor is {temperatureSensor.temperatureValue} degrees
					    									</Card.Text>
					    								}
					    							})}
						    						
						    						<Card.Footer className="temperature-sensor-footer">
						    							<a href="#">Delete</a>
						    							<a href="#">Change</a>
						    						</Card.Footer>
						    					</Card.Body>
						    				</Card>
						    			</td>
						    			<td>
						    				{ this.state.lightSensors.map(lightSensor => {
						    					for (var i = 0; i < room.sensors.length; i++) {
			    									if (room.sensors[i].guid == lightSensor.guid)
									    				return <Card key = {lightSensor.guid} className="sensor-card">
									    					<Card.Body>
						    								    <Card.Text>
						    										Light status of {lightSensor.name} sensor is {} {lightSensor.status.toString()}
						    									</Card.Text>
								    							<Button variant="primary">Turn {lightSensor.status === true ? "Off": "On"}</Button>
									    					</Card.Body>
									    					<Card.Footer className="temperature-sensor-footer">
								    							<a href="#">Delete</a>
								    						</Card.Footer>	
									    				</Card>
						    					}
						    				})}
						    			</td>
						    			<td>
						    				<ButtonGroup>
						    					<Button size="sm" variant="outline-primary">
						    						<FontAwesomeIcon icon={ faEdit } />
					    						</Button>
					    						<Button size="sm" variant="outline-danger" onClick={this.deleteRoom.bind(this, room.guid)}>
					    							<FontAwesomeIcon icon={ faTrash } />
					    						</Button>
						    				</ButtonGroup>
						    			</td>
						    		</tr>
						    	))
						  	}
						    
						  </tbody>
						</Table>
					</Card.Body>
				</Card>
			</div>
			
		)
	}	
}
