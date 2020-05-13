import React, { Component } from 'react';
import { Card, Table, ButtonGroup, Button, Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import DataTable from 'react-data-table-component';
import OperationNotification from './OperationNotification.js'; 
import axios from 'axios';
import { Link } from 'react-router-dom';

import '../styles/rooms.scss';

export default class Rooms extends Component {

	constructor(props) {
		super(props)
		this.state = this.initialState;
	};

	initialState = {
		rooms: [],
		showMessage: '',
		typeMessage: '',
		temperatureSensorGuids: "",
		lightSensorGuids: "",
		temperatureSensors: [],
		lightSensors: [],
		amountOfTemperatureSensors: 0,
		amountOfLightSensors: 0,
		isLoadedRoomInfo: true,
		roomColumns: [
	      {
	        name: 'Name',
	        selector: 'name',
	        sortable: 'asc',
	        cell: (row) => 
	        	<div>
	        		<Link to = { "room-info/"+row.guid }>
						{row.name}
					</Link>
	        	</div>,
	        center: true,
	        width: '20%',
	        selectableRows: true
	      },
	      {
	      	name: 'Temperature sensor is present',
	      	selector: 'amount of temperature sensor',
	      	cell: (row) =>
	      		<div>
	      			{row.sensors.filter(sensor => sensor.type === "TEMPERATURE").length === 1 ? "Yes" : "No"}
	      		</div>,
	      	center: true,
	      	selectableRows: true
	      },
	      {
	      	name: 'Amount of Light sensor',
	      	selector: 'amount of light sensor',
	      	cell: (row) =>
	      		<div>
	      			{row.sensors.filter(sensor => sensor.type === "LIGHT").length}
	      		</div>,
	      	center: true,
	      	selectableRows: true
	      },
	      {
	      	cell: (row) =>
	      		<div>
	      			<Link to = { "edit-room/"+row.guid } className="btn btn-sm btn-outline-primary">
						Edit
					</Link>
		      		<Button size="sm" variant = "outline-danger" type="button" onClick={(event) => this.deleteRoom(row.guid)}>Delete</Button>
		      	</div>
	      	,
    		ignoreRowClick: true,
    		allowOverflow: true,
    		button: true,
    		name: 'Actions',
    		center: true,
    		width: '10%',
    		selectableRows: true
	      }
        ],
        roomsData: []
	};

	parseSensorGuids() {
		for (let i = 0; i < this.state.rooms.length; i++) {
		    for (let j = 0; j < this.state.rooms[i].sensors.length ; j++) {
		        if (this.state.rooms[i].sensors[j].type === "TEMPERATURE" ) {
		            this.state.temperatureSensorGuids += this.state.rooms[i].sensors[j].guid + ","
		            this.state.amountOfTemperatureSensors += 1
		        } else if (this.state.rooms[i].sensors[j].type === "LIGHT" ) {
		            this.state.lightSensorGuids += this.state.rooms[i].sensors[j].guid + ","
		            this.state.amountOfLightSensors += 1
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
						rooms: data,
						roomsData: data.map((room, index) => {
							return {
								id: index,
								name: room.name,
								guid: room.guid,
								sensors: room.sensors
							}
						}).reverse()
					})
					this.parseSensorGuids()
				})

		this.setState({
			roomsData: this.state.roomsData.reverse(),
			isLoadedRoomInfo: false
		})
	};


	deleteRoom = (roomGuid) => {
		axios.delete("http://localhost:8081/room/" + roomGuid)
			.then(response => {
				if (response.data != null) {
					this.setState({
						"show": true,
						"showMessage": 'Roow was deleted succesfully.',
						"typeMessage": 'danger'
					})
					setTimeout(() => this.setState({"show": false}), 3000)
					this.setState({
						roomsData: this.state.roomsData.filter(room => room.guid !== roomGuid)
					})
				} else {
					this.setState({"show": false})
				}
			})
	};

	deleteTemperatureSensor = (sensor) => {
		let temperatureDto = {
			guid: sensor.guid,
			type: "TEMPERATURE"
		}
		axios.put("http://localhost:8081/room/remove-sensors/", [temperatureDto])
			.then(response => {
				if (response.data != null) {
					this.setState({
						"show": true,
						"showMessage": 'Sensor was deleted from room succesfully.',
						"typeMessage": 'danger'
					})
					setTimeout(() => this.setState({"show": false}), 3000)
					console.log(this.state.temperatureSensors)
					window.location.reload()
				} else {
					this.setState({"show": false})
				}
			})
	};

	deleteLightSensor = (sensor) => {
		let lightDto = {
			guid: sensor.guid,
			type: "LIGHT"
		}
		axios.put("http://localhost:8081/room/remove-sensors/", [lightDto])
			.then(response => {
				if (response.data != null) {
					this.setState({
						"show": true,
						"showMessage": 'Sensor was deleted from room succesfully.',
						"typeMessage": 'danger'
					})
					setTimeout(() => this.setState({"show": false}), 3000)
					console.log(this.state.temperatureSensors)
					window.location.reload()
				} else {
					this.setState({"show": false})
				}
			})
	};

	render() {
		return (
			<div>
				<div style = {{ "display": this.state.show ? "block" : "none" }}>
					<OperationNotification show = { this.state.show } message = { this.state.showMessage } type = { this.state.typeMessage }/>
				</div>
				<Container className = "room-data-table">
					<Row>
						<Col >
							<DataTable
							    title="Room name"
							    actions = {
							    	<Link to = { "add-room" } className="btn btn-sm btn-outline-primary">
			    						Add new room
			    					</Link>
							    }
							    columns={this.state.roomColumns}
							    data={this.state.roomsData}
							    progressPending = {this.state.isLoadedRoomInfo}
							    pagination = {true}
							    overflowY = {true}
							    selectableRows = {true}
							 />
						</Col>
					</Row>
				</Container>
			</div>
			
		)
	}	
}
